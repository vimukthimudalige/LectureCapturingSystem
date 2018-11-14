import axios from 'axios';

export function recalibrateCamera() {
    return axios.get('/api/recalibrateCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function turnLeftCamera() {
    return axios.get('/api/turnLeftCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function turnRightCamera() {
    return axios.get('/api/turnRightCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function turnUpCamera() {
    return axios.get('/api/turnUpCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function turnDownCamera() {
    return axios.get('/api/turnDownCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function stopMovementCamera() {
    return axios.get('/api/stopMovementCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function zoomInCamera() {
    return axios.get('/api/zoomInCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function zoomOutCamera() {
    return axios.get('/api/zoomOutCamera')
        .then(res => res.data)
        .catch(error => error);
}

export function go_to_podium() {
    return axios.get('/api/go_to_podium')
        .then(res => res.data)
        .catch(error => error);
}

export function runTrackerScript() {
    return axios.get('/api/runTrackerScript')
        .then(res => res.data)
        .catch(error => error);
}

export function turn_to_audience() {
    return axios.get('/api/turn_to_audience')
        .then(res => res.data)
        .catch(error => error);
}

export function startLectureTracker() {
    return axios.get('/api/startLectureTracker')
        .then(res => res.data)
        .catch(error => error);
}

export function startGestureDetection() {
    return axios.get('/api/startGestureDetection')
        .then(res => res.data)
        .catch(error => error);
}

export function stopTracker() {
    return axios.get('/api/stopTracker')
        .then(res => res.data)
        .catch(error => error);
}

export function saveIPStream() {
    return axios.get('/api/saveIPStream')
        .then(res => res.data)
        .catch(error => error);
}
