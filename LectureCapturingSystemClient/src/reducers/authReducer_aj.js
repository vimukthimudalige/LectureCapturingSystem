import constants from '../constants/actionTypes'

var initialState = {
    loggedIn: sessionStorage.getItem('token') ? true : false,
    username: sessionStorage.getItem('username') ? sessionStorage.getItem('username') : '',
    usertype: sessionStorage.getItem('usertype') ? sessionStorage.getItem('usertype') : '',
    getRegisterResponseMsg: '',
    getAllUsers : []
}

export default (state = initialState, action) => {

    var updated = Object.assign({}, state);

    switch(action.type) {

        case constants.USER_REGISTERED:
            updated['loggedIn'] = true;
            updated['username'] = action.username;
            updated['usertype'] = action.usertype;
            updated['getAllUsers'] = action.getAllUsers;

            return updated;

        case constants.USER_LOGGEDIN:
            updated['loggedIn'] = true;
            updated['username'] = action.username;
            updated['usertype'] = action.usertype;
            updated['getAllUsers'] = action.getAllUsers;

            return updated;

        case constants.USER_LOGOUT:
            updated['loggedIn'] = false;
            updated['username'] = '';
            updated['usertype'] = '';
            updated['getRegisterResponseMsg'] = '';
            updated['getAllUsers'] = '';
            return updated;

        case constants.GET_REGISTER_RESPONSE_MESSAGE:
            updated['getRegisterResponseMsg'] = action.getRegisterResponseMsg;
            return updated;

        case constants.GET_ALL_USERS:
            updated['getAllUsers'] = action.getAllUsers;
            return updated;

        default:
            return state;
    }
}