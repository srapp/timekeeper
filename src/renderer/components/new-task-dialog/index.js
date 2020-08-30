import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

export const NewTaskDialog = ({ isOpen, onClose, createNewTask }) => {
    const [form, setForm] = useState({ name: '' });

    useEffect(() => {
        if(isOpen) {
            setForm({ name: '' });
        }
    }, [isOpen])

    const onSubmit = () => {
        if(form.name) {
            createNewTask(form);
            onClose();
        }
    };

    const NewTaskForm = () => {
        const inputRef = useRef();

        useEffect(() => {
            inputRef.current.focus();
        }, []);

        const onKeyUp = (e) => {
            if(e.keyCode === 13) {
                onSubmit(form)
            }
        }

        return (
            <TextField label="Task Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onKeyUp={onKeyUp} inputRef={inputRef}/>
        );
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent>
                <NewTaskForm/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit}>Create Task</Button>
            </DialogActions>
        </Dialog>
    );
}