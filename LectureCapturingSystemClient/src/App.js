import React, { Component } from 'react';
import './App.css';
import './css/SideNav_aj.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import openSocket from 'socket.io-client';

import Home from './components/layouts/Home';
import About from './components/layouts/About';
import Layout from './components/layouts/Layout';
import UserManagement_aj from './components/presentation/afterLogin/admin/UserManagement_aj';
import AttendanceManagement_aj from './components/presentation/afterLogin/admin/AttendanceManagement_aj';
import Dashboard_aj from './components/presentation/afterLogin/Dashboard_aj';
import Register_aj from './components/presentation/afterLogin/admin/Register_aj';
import LoginSelection_aj from './components/presentation/beforeLogin/LoginSelection_aj';
import LiveStream_vr from './components/presentation/afterLogin/lecturer/LiveStream_vr';
import MainView_vm from './components/presentation/afterLogin/lecturer/MainView_vm';
import ViewUsers_aj from './components/presentation/afterLogin/admin/ViewUsers_aj';
import FaceLogin from './components/presentation/beforeLogin/FaceRecognition/FaceLogin';
import LectureVideos_lt from "./components/presentation/afterLogin/lecturer/LectureVideos_lt";
import VideoChapters_lt from "./components/presentation/afterLogin/lecturer/VideoChapters_lt";
import adminDashboard from './components/presentation/afterLogin/admin/adminDashboard';
import Attendance1 from './components/presentation/afterLogin/admin/Attendance';
import Attendance2 from './components/presentation/afterLogin/admin/Attendance2';
import Bandwidth from './components/presentation/afterLogin/admin/Bandwidth';
import CourseManagement from './components/presentation/afterLogin/admin/CourseManagement_vm';
import addCourse_vm from "./components/presentation/afterLogin/admin/addCourse_vm";
import viewCourse_vm from "./components/presentation/afterLogin/admin/viewCourses_vm";
import {config} from "./configurations/config";

class App extends Component {

    socket = openSocket(config.apiUrl);
    componentDidMount() {
        // const socket = openSocket('http://127.0.0.1:5000');

        //socket.on("FromAPI", data => this.setState({ response: data }));
        var visitorData = {
            referringSite: window.document.referrer,
            page: window.location.pathname
        }
        this.socket.emit('visitor-data', visitorData);

    }

    componentWillUnmount() {
        this.socket = {};
    }

    render() {
        return (
            <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path="/" component={LoginSelection_aj} />
                    <Route path="/about" component={About} />
                    <Route path="/home" component={Home} />
                    <Dashboard_aj>
                    <Route path="/userManagement/:userid" component={UserManagement_aj} />
                    <Route path="/userManagement/viewUser/:userid" component={ViewUsers_aj} />
                    <Route path="/userManagement/registerUser/:userid" component={Register_aj} />
                    <Route path="/liveStream/:userid" component={LiveStream_vr} />
                    <Route path="/mainView/:userid" component={MainView_vm} />
                    <Route path="/lectureVideos/:userid" component={LectureVideos_lt} />
                    <Route path="/videoChapters/:userid" component={VideoChapters_lt} />
                    <Route path="/adminDashboard/:userid" component={adminDashboard} />
                    <Route path="/bandwidth/:userid" component={Bandwidth} />
                    <Route path="/attendanceManagement/:userid" component={AttendanceManagement_aj} />
                    <Route path="/attendanceManagement/attendance1/:userid" component={Attendance1} />
                    <Route path="/attendanceManagement/attendance2/:userid" component={Attendance2} />
                    <Route path="/courseManagement/:userid" component={CourseManagement} />
                        <Route path="/courseManagement/viewCourse/:userid" component={viewCourse_vm} />
                        <Route path="/courseManagement/addNewCourse/:userid" component={addCourse_vm} />
                    </Dashboard_aj>
                </Switch>
            </Layout>
            </BrowserRouter>
        );
    }
}

export default App;