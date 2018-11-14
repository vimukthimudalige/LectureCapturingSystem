import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { coursesRetrieved } from "../../../../actions/courseActions_vm";
import { connect } from "react-redux";
import { getAllCourses } from '../../../../actions/courseActions_vm';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import "../../../../css/editUsers.css"
class viewCourse_vm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            redirect: false,
            msg: '',
            coursename: '',
            modulecode: '',
            duration: '',
            _id: '',
            credits: '',
            courses: []
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.logChange = this.logChange.bind(this);
    }

    componentDidMount() {
        fetch('/course/getAllCourses')
            .then(response => {
                return response.json();
            })
            .then(courses => {
                this.setState({
                    courses: courses.data.result
                });
            });
    }


    openModal(courses) {
        this.setState({
            modalIsOpen: true,
            coursename: courses.coursename,
            modulecode: courses.modulecode,
            duration: courses.duration,
            _id: courses._id,
            credits: courses.credits
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    logChange(e) {
        this.setState({

            [e.target.name]: e.target.value
        });
    }

    deleteCourse(course, index) {

        if (course != null && index != null) {

            var tempCourse = [...this.state.courses];
            tempCourse.splice(index, 1);
            this.setState({
                courses: tempCourse
            });

            var data = {
                courseID: course._id
            };
            fetch("/course/delete", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Bad response from server");
                }
                alert("Course Deleted");
                return response.json();
            }).catch(function (err) {
                console.log(err)
            });
        }
    }

    handleEdit(event) {
        event.preventDefault();
        var data = {
            coursename: this.state.coursename,
            modulecode: this.state.modulecode,
            duration: this.state.duration,
            credits: this.state.credits,
            _id: this.state._id
        };
        fetch("/course/updateCourse", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("Bad response from server");
            }
            alert("Course Updated");
            this.setState({
                msg: "Course has been edited."
            });
            return response.json();
        }).catch(function (err) {
            console.log(err)
        });
    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    renderCourses() {
        return this.state.courses.map((courses, index) => {
            return (
                <tr key={courses._id}>
                    <td>{index + 1}</td>
                    <td>{courses.coursename}</td>
                    <td>{courses.modulecode}</td>
                    <td>{courses.duration}</td>
                    <td>{courses.credits}</td>
                    <td>{courses.created.substring(0, 10)}</td>


                    <td><a onClick={() => this.openModal(courses)}>Edit</a> | <a onClick={() => {if (window.confirm('Are you sure you wish to delete this item?')) this.deleteCourse(courses, index)} }>Delete</a></td>

                </tr>

            );
        })
    }

    render() {

        if (this.state.redirect) {
            return (<Redirect to={'/'} />)
        }

        return (
            <div>

                <table id="example" className="table table-striped table-bordered dt-responsive nowrap">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Course Name</th>
                            <th>Module Code</th>
                            <th>Duration</th>
                            <th>Credits</th>
                            <th>Added Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.renderCourses()}


                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel="Edit Courses"
                            className="Modal"
                        >
                            <div style={
                                {
                                    padding: '20px 20px 20px 20px'
                                }
                            }>
                                <p style={{ float: "right" }} onClick={this.closeModal}><span className="glyphicon glyphicon-remove"></span></p>
                                <h2 style={{ padding: '0px 0px 5px 0' }} >Edit Courses</h2>
                                <div className="form-group">
                                    <label>Coursename</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.coursename} name='coursename' validations={['required']} />
                                </div>
                                <div className="form-group">
                                    <label>Module Code</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.modulecode} name='modulecode' validations={['required']} />
                                </div>

                                <div className="form-group">
                                    <label>Duration</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.duration} name='duration' validations={['required']} />
                                </div>

                                <div className="form-group">
                                    <label>Credits</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.credits} name='credits' validations={['required']} />
                                </div>



                                <div className="submit-section">
                                    <button className="btn btn-success btn-send" onClick={this.handleEdit.bind(this)} style={{ float: "right" }}>Update Course</button>
                                    {/*<button className="btn btn-success btn-send" style={{ float: "right" }}>Update Course</button>*/}
                                </div>
                            </div>
                        </Modal>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default viewCourse_vm;