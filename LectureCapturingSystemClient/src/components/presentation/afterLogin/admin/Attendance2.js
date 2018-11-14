import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
// import { makeData, Logo, Tips } from "../../../../css/TableUtil";

// Import React Table
import ReactTable from "react-table";
import "../../../../../node_modules/react-table/react-table.css";
import {config} from '../../../../configurations/config';

class Attendance2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableUpdateAlert : false,
            attendanceMarkingAlert: false,
            attendanceError: false,
            redirect: false,
            attendanceDataSet: []        };

        this.markAttendance.bind(this);
        this.getAllattendance = this.getAllattendance.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    componentWillUnmount() {

        fetch('/student/releaseWebCam')
            .then(response => {
                return null;
            })
            .then(data => {

            });
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



    deleteAttendance(attendance, index) {

        console.log("deleteAttendance :" + JSON.stringify(attendance));
        console.log("deleteAttendance index:" + JSON.stringify(index));


        if (attendance != null && index != null) {

            var tempAttendance = [...this.state.attendanceDataSet];
            tempAttendance.splice(index, 1);
            this.setState({
                attendanceDataSet: tempAttendance
            });

            var data = {
                attendanceId: attendance.original._id
            }

            console.log("Delete DATA:" + attendance.original._id);

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

    markAttendance() {

        this.setState({
            attendanceMarkingAlert: true,
            tableUpdateAlert : false,
            attendanceError: false
        });

        fetch('/student/markAttendance2')
            .then(response => {
                if (!response.ok) {
                    console.log("Client().faceRecognize().Error :" + response.statusText);
                    this.setState({
                        tableUpdateAlert : false,
                        attendanceMarkingAlert : false,
                        attendanceError: true
                    });
                    throw Error(response.statusText);
                }
                console.log("Client().faceRecognize().Success");
                this.getAllattendance();
                this.setState({
                    attendanceMarkingAlert : false,
                    attendanceError: false,
                    tableUpdateAlert : true

                });
                return response.json();
            })
            .then(data => {

            })
            .catch((e) => console.log(e));
    }

    getAllattendance() {
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

    render() {
        if (this.state.redirect) {
            return (<Redirect to={'/'} />)
        }

        const { attendanceDataSet } = this.state;

        const faceAlert = (<div className="alert alert-danger" role="alert">Unknown faces! Please try again!</div>);
        const markingAlert = (<div className="alert alert-success" role="alert">Attendance marking Started..</div>);
        const tableUpdate = (<div className="alert alert-success" role="alert">Attendance Marked Successfully..Table Updated!</div>);

        return (
            <div>
                {/* <h3>Mark Attendance</h3> */}
                <div className="row">
                    <div className="col-md-4">
                        {/*<img src="http://localhost:5004/video_feed" width="500" height="300" ></img>*/}
                        <img src={config.pythonServerUrl} width="500" height="300" ></img>

                        <button onClick={this.markAttendance.bind(this)}
                            className="btn btn-primary btn-lg btn-block" style={{ margin: '0 0 0 15%' }}>Mark Attendance</button>
                        <div style={{ margin: '0 0 0 15%' }}>
                        {this.state.attendanceError === true ? faceAlert : null}
                        {this.state.attendanceMarkingAlert === true ? markingAlert : null}
                        {this.state.tableUpdateAlert === true ? tableUpdate : null}
                        </div>
                    </div>
                    {/* <div className="col-md-6" style={{ margin: '0 0 0 10%' }}>
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

                                {this.organizeAttendanceDataSet()}
                            </tbody>
                        </table>
                    </div>
                </div> */}

                    <div className="col-md-6" style={{ margin: '0 0 0 10%' }}>

                        <ReactTable
                            data={attendanceDataSet}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            columns={[
                                {
                                    Header: "Id",
                                    id: "_id",
                                    Cell: row => row.index + 1,
                                    width: 30


                                }, {
                                    Header: "Name",
                                    accessor: "username"
                                }, {
                                    Header: "User Type",
                                    accessor: "usertype"
                                }, {
                                    Header: "Status",
                                    accessor: "status"
                                }, {
                                    Header: "Date",
                                    id: "created",
                                    accessor: (row) => row.created.substring(0, 10)
                                    // Cell:  value  => value.substring(0,10)
                                }, {
                                    Header: "Time",
                                    id: "created1",
                                    accessor: (row) => row.created.substring(12, 19),
                                    width: 80
                                    // Cell: value => value.substring(12,19)

                                },
                                {
                                    Header: "",
                                    id: "delete",
                                    Cell: (row) => (
                                        <a onClick={() => this.deleteAttendance(row, row.index)}><span className="glyphicon glyphicon-remove"></span></a>
                                    ),
                                    width: 50
                                    // Cell: value => value.substring(12,19)

                                }
                            ]}
                            defaultPageSize={5}
                            className="-striped -highlight"
                        />
                    </div>

                </div>
            </div>
        )
    }
}

export default Attendance2;