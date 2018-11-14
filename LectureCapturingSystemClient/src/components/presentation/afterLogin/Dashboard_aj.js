import React, { Component } from 'react';
import constants from "../../../constants/actionTypes";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Route, BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';


class Dashboard_aj extends Component {

    switchDashboards = () => {


        if (sessionStorage.getItem("userid")) {
            var userId = sessionStorage.getItem('userid');
        }

        if (sessionStorage.getItem("usertype")) {
            var usertype = sessionStorage.getItem('usertype');
        }

        console.log("this.props.usertype :" + usertype);
        switch (usertype) {

            case 'admin':
                const adminDashboard = (<div className="sidenav">
                    <Link to={'/adminDashboard/' + userId}>Dashboard</Link>
                    <Link to={'/userManagement/viewUser/'+userId}>User Management</Link>
                    <Link to={'/bandwidth/'+userId}>Bandwidth Management</Link>
                    <Link to={'/attendanceManagement/'+userId}>Attendance Management</Link>
                    <Link to={'/courseManagement/viewCourse/'+userId}>Course Management</Link>
                    {/*<a href="#contact">Settings</a>*/}
                </div>);

                return adminDashboard;

            case 'lecturer':
                const lecturerDasboard = (<div className="sidenav">
                    <Link to={'/lectureVideos/' + userId}>Lecturer Dashboard</Link>
                    <Link to={'/mainView/' + userId}>Main View</Link>
                    <Link to={'/liveStream/' + userId}>Live Stream</Link>
                    {/*<Link to={'/lectureVideos/' + userId}>Lecture Videos</Link>*/}
                    {/*<a href="#contact">Settings</a>*/}
                </div>);

                return lecturerDasboard;

            case 'student':
                const studentDasboard = (<div className="sidenav">
                    <Link to={'/lectureVideos/' + userId}>Student Dashboard</Link>
                    <Link to={'/liveStream/' + userId}>Live Stream</Link>
                    {/*<a href="#clients">Attendance</a>*/}
                    {/*<a href="#contact">Settings</a>*/}

                    </div>
                    );

                return studentDasboard;
        }
    };

    render() {

        return (
            <div>
                {this.switchDashboards()}

                <div className="main">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        usertype: state.auth.usertype
    }
}

export default withRouter(connect(mapStateToProps)(Dashboard_aj));


// export default Dashboard_aj;