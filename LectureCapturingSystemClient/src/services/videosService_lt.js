import axios from 'axios';

export function getAllVideos() {
    return axios.get('/api/videos')
        .then(res => res.data)
        .catch(error => error);
}

export function createVideoChaptersService(lectureVideo) {
    return axios.post('/api/videoChapters', {
        lectureVideo: lectureVideo,
        status: 'processed'
    })
        .then(res => res.data)
        .catch(error => error);
}

export function getOneVideo(lectureVideo) {
    return axios.get('/api/video?lectureVideo=' + lectureVideo)
        .then(res => res.data)
        .catch(error => error);
}