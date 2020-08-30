import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Typography from '@material-ui/core/Typography';
import { format, formatDistanceStrict } from 'date-fns';

const formatDate = (timestamp) => format(timestamp, 'M/d/yy')
const formatTime = (timestamp) => format(timestamp, 'h:mmaaaaa');
const calculateTotalTime = (recordings) => {
    const totalDuration = recordings.map(({start, end}) => (end || Date.now()) - start)
        .reduce((prev, curr) => prev + curr, 0)

    return formatDistanceStrict(0, totalDuration, { unit: 'minute' })
}

export const Task = ({ task: { id, name, isRecording, recordings, createdAt }, startRecording, stopRecording }) => {
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    useEffect(() => {
        let interval = null;
        if(isRecording) {
            interval = setInterval(() => setLastUpdated(Date.now()), 60000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const RecordingButton = () => {
        const style = { fontSize: 36 };
        const icon = isRecording ? <PauseIcon {...{ style }} color="secondary"/> : <PlayArrowIcon {...{ style }}/>;
        const onClick = isRecording ? () => stopRecording(id) : () => startRecording(id)

        return <IconButton {...{ onClick }}>{icon}</IconButton>
    }

    const RecordingsList = () => {
        return <div>
            <Typography variant="caption" style={{ color: '#bbb'}}>
                {recordings.map(({start, end}) => `${formatTime(start)}-${end ? formatTime(end) : ''}`).join(', ')}
            </Typography>
        </div>
    }

    return (
        <Card variant="outlined" style={{ width: '100%' }}>
            <CardContent>
                <Grid container justify="space-between" alignItems="flex-start" wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="body1">{calculateTotalTime(recordings)}</Typography>
                        <RecordingsList/>
                    </Grid>
                    <Grid item>
                        <RecordingButton/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
