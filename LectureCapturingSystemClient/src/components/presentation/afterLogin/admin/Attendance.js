import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Webcam from 'react-webcam';
import { isNull } from 'util';

class Attendance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attendanceError: false,
            redirect: false,
            attendanceDataSet: []
        };

        this.capture.bind(this);
        this.getAllattendance.bind(this);
        this.faceRecognize.bind(this);
        // this.organizeAttendanceDataSet = this.organizeAttendanceDataSet.bind(this);

    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    componentDidMount() {
        fetch('/student/getAllAttendance')
            .then(response => {
                return response.json();
            })
            .then(dataset => {
                this.setState({
                    attendanceDataSet: dataset.data.result
                });
            });
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    };

    capture = () => {
        let imageSrc = this.webcam.getScreenshot();
        if (imageSrc != isNull) {
            console.log("Image src :" + imageSrc);
            let base64 = { imageString: imageSrc };
            console.log("imageString :" + base64);
            this.faceRecognize(base64);
        } else {
            console.log("Please try again!");
        }

    };

    faceRecognize(base64) {
        fetch('/student/attendance', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(base64),
            mode: 'cors'
        }).then(response => {
            if (!response.ok) {
                console.log("Client().faceRecognize().Error :" + response.statusText);
                this.setState({
                    attendanceError: true
                });
                throw Error(response.statusText);
            }
            console.log("Client().faceRecognize().Success");
            this.getAllattendance();
            return response.json();
        })
            .then(data => {
                
            })
            .catch((e) => console.log(e));
    }

    getAllattendance(){
        fetch('/student/getAllAttendance')
        .then(response => {
            return response.json();
        })
        .then(dataset => {
            this.setState({
                attendanceDataSet: dataset.data.result
            });
        });
    }

    deleteAttendance(attendance, index) {

        if (attendance != null && index != null) {

            var tempAttendance = [...this.state.attendanceDataSet];
            tempAttendance.splice(index, 1);
            this.setState({
                attendanceDataSet: tempAttendance
            });

            var data = {
                attendanceId: attendance._id
            }
            fetch("/student/delete", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Bad response from server");
                }
                return response.json();

            }).catch(function (err) {
                console.log(err)
            });
        }
    }

    organizeAttendanceDataSet() {

        return this.state.attendanceDataSet.map((dataset, index) => {
            return (
                <tr key={dataset._id}>
                    <td>{index + 1}</td>
                    <td>{dataset.username}</td>
                    <td>{dataset.usertype}</td>
                    <td>{dataset.status}</td>
                    <td>{dataset.created.substring(0, 10)}</td>
                    <td>{dataset.created.substring(12, 19)}</td>
                    <td><a onClick={() => this.deleteAttendance(dataset, index)}>Delete</a></td>
                </tr>
            );
        })
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to={'/'} />)
        }

        const faceAlert = (<div className="alert alert-danger" role="alert">Server Error! Please try again!</div>);
        const webcamCode = (
            <div>
                <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    style={{ margin: '0 0 0 15%' }}
                />

                <button onClick={this.capture}
                    className="btn btn-primary btn-lg btn-block"  style={{ margin: '0 0 0 15%' }}>Mark Attendance</button>

                {this.state.attendanceError === true ? faceAlert : null}

            </div>
        );


        return (
            <div>
                <h3>Attendance Management</h3>

                <div className="row">
                    <div className="col-md-4">
                        {webcamCode}
                    </div>
                    <div className="col-md-6" style={{ margin: '0 0 0 10%' }}>
                        <table id="example" className="table table-striped table-bordered dt-responsive nowrap">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>User Name</th>
                                    <th>User Type</th>
                                    <th>Present/Absent</th>
                                    <th>Date</th>  
                                    <th>Time</th>            
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td>{localStorage.getItem('id')}</td>
                                    <td>{localStorage.getItem('name')}</td>
                                    <td>{localStorage.getItem('type')}</td>
                                    <td>{localStorage.getItem('status')}</td>
                                    <td>{localStorage.getItem('date')}</td>
                                </tr> */}
                                {this.organizeAttendanceDataSet()}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        )
    }
}

export default Attendance;