import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { v1 as uuidv1 } from 'uuid';
import Store from 'electron-store';

import { Task } from './components/task';
import { NewTaskDialog } from './components/new-task-dialog';

const stopRecordingTask = (task) => {
    const { isRecording, recordings } = task;
    const update = { ...task };

    if(isRecording) {
        // This means this task was previously recording and needs to stop
        const lastRecording = recordings[recordings.length-1];
        update.recordings = [...recordings.slice(0, -1), { ...lastRecording, end: Date.now() }];
        update.isRecording = false
    }

    return { ...task, ...update }
}

const startRecordingTask = (task) => {
    const { isRecording, recordings } = task;
    const update = { ...task };

    if (!isRecording) {
        // This means this task wasn't recording and needs to start
        update.recordings = [...recordings, { start: Date.now(), end: null }];
        update.isRecording = true;
    }

    return { ...task, ...update }
}

const store = new Store();

const TasksContainer = () => {
    const [tasks, setTasks] = useState({
        byId: {},
        order: []
    });

    const [isNewTaskOpen, setNewTaskOpen] = useState(false);

    useEffect(() => {
        if(!Object.keys(tasks.byId).length) {
            const storedTasks = store.get('tasks');
            storedTasks && setTasks(JSON.parse(storedTasks))
            console.log('LOAD')
        } else {
            console.log('SAVE')
            store.set('tasks', JSON.stringify(tasks))
        }
    }, [tasks]);

    const createNewTask = ({ name }) => {
        const id = uuidv1()
        setTasks({
            byId: { ...tasks.byId, [id]: {
                id,
                name,
                createdAt: Date.now(),
                isRecording: false,
                recordings: []
            }},
            order: [ ...tasks.order, id ]
        })
    };

    const updateTask = (id, delta) => {
        setTasks({
            ...tasks,
            byId: { ...tasks.byId, [id]: {...tasks.byId[id], ...delta }}
        })
    };

    const startRecording = (id) => {
        setTasks({
            ...tasks,
            byId: Object.fromEntries(Object.entries(tasks.byId).map(([key, val]) => key === id ? (
                [ key, startRecordingTask(val) ]
            ) : (
                [ key, stopRecordingTask(val) ]
            )))
        });
    };

    const stopRecording = (id) => {
        updateTask(id, stopRecordingTask(tasks.byId[id]))
    }

    return (
        <div>
            <Grid container direction="column" wrap="nowrap" spacing={1}>
                <Grid item>
                    <Typography variant="h5">Current Tasks</Typography>
                </Grid>
                {
                    tasks.order.map(id => tasks.byId[id]).map(task => (
                        <Grid item key={task.id}>
                            <Task {...{ task, startRecording, stopRecording }}/>
                        </Grid>
                    ))
                }
                <Grid item style={{ alignSelf: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={() => setNewTaskOpen(true)}>New Task</Button>
                </Grid>
            </Grid>
            <NewTaskDialog isOpen={isNewTaskOpen} onClose={() => setNewTaskOpen(false)} createNewTask={createNewTask}/>
        </div>
    )
}

export const App = () => (
    <div>
        <TasksContainer/>
    </div>
);