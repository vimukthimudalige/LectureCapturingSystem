import actionTypes from '../constants/actionTypes';

export function getNewCourseResponseMessage(getNewCourseResponseMessage){
    return {
        type: actionTypes.GET_NEW_COURSE_RESPONSE_MESSAGE,
        getNewCourseResponseMessage : getNewCourseResponseMessage
    }
}

export function coursesRetrieved(courseDetails){
    return {
        type: actionTypes.GET_ALL_COURSES,
        getAllCourses : courseDetails
    }
}

export function addNewCourse(data){
    return dispatch => {
        return fetch('/course/addCourse', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    dispatch(getNewCourseResponseMessage('error'));
                    throw Error(response.statusText);
                }
                console.log("Successfully Registered");

                dispatch(getNewCourseResponseMessage('success'));
                console.log('dispatched success');
                return response.json();
            })
            .then( (data) => {
            })
            .catch( (e) => console.log(e) );
    }
}

export function getAllCourses(){
    return dispatch => {
        return fetch(`/course/getAllCourses`)
            .then( (response) => {
                if (!response.ok) {
                    console.log("getAllCourses().Error retrieving course details");
                    throw Error(response.statusText);
                }
                console.log("Successfully got course details");

                return response.json();
            })
            .then( (data) => dispatch(coursesRetrieved(data.data)))
            .catch( (e) => console.log(e) );
    }
}