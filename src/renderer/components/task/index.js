import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Typography from '@material-ui/core/Typography';
import { format, formatDistanceStrict } from 'date-fns';

const iconStyles = { fontSize: 36 };
const formatTime = (timestamp) => format(timestamp, 'h:mmaaaaa');
const calculateTotalTime = (recordings) => {
    const totalDuration = recordings.map(({start, end}) => (end || Date.now()) - start)
        .reduce((prev, curr) => prev + curr, 0)

    return formatDistanceStrict(0, totalDuration, { unit: 'minute' })
}

const RecordingsList = ({ recordings }) => {
    return <div>
        <Typography variant="caption" style={{ color: '#bbb'}}>
            {recordings.map(({start, end}) => `${formatTime(start)}-${end ? formatTime(end) : ''}`).join(', ')}
        </Typography>
    </div>
}

const RecordingButton = ({ task: { id, isRecording }, startRecording, stopRecording }) => {
    const icon = isRecording ? <PauseIcon style={iconStyles} color="secondary"/> : <PlayArrowIcon style={iconStyles}/>;
    const onClick = isRecording ? () => stopRecording(id) : () => startRecording(id)

    return <IconButton {...{ onClick }}>{icon}</IconButton>
}

const DeleteButton = ({ task: { id }, deleteTask }) => {
    return <IconButton color="secondary" onClick={() => deleteTask(id)}><DeleteForeverIcon style={iconStyles}/></IconButton>
}

export const Task = ({ task, task: { name, isRecording, recordings }, startRecording, stopRecording, isManaging, deleteTask }) => {
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    useEffect(() => {
        let interval = null;
        if(isRecording) {
            interval = setInterval(() => setLastUpdated(Date.now()), 60000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    return (
        <Card variant="outlined" style={{ width: '100%' }}>
            <CardContent>
                <Grid container justify="space-between" alignItems="center" wrap="nowrap" spacing={2}>
                    {isManaging && (
                        <Grid item>
                            <DeleteButton {...{ task, deleteTask }}/>
                        </Grid>
                    )}
                    <Grid item style={{ width: '100%' }}>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="body1">{calculateTotalTime(recordings)}</Typography>
                        <RecordingsList {...{ recordings }}/>
                    </Grid>
                    {!isManaging && (
                        <Grid item>
                            <RecordingButton {...{ task, startRecording, stopRecording }}/>
                        </Grid>
                    )} 
                </Grid>
            </CardContent>
        </Card>
    );
}
