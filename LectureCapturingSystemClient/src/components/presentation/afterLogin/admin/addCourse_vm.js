import React, { Component} from 'react';
import { getNewCourseResponseMessage, coursesRetrieved, addNewCourse, getAllCourses} from '../../../../actions/courseActions_vm';
import { connect } from 'react-redux';
import { Button,Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import '../../../../css/register.css';
import {Redirect} from 'react-router-dom';

class addCourse_vm extends Component {

    constructor(){
        super();

        this.state = {
            details:{
            },
            files: [],
            redirect:false
        };

    }

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    addNewCourse(){

        alert("Course Added");

        const imageNames = [];
        let userTypeFound = false;

        this.state.files.map(f =>
            imageNames.push(f.name)

        );

        if (this.state.details.hasOwnProperty("usertype")) {
            userTypeFound = true;
        }
        this.props.dispatch(addNewCourse(this.state.details,imageNames,userTypeFound));
        //return <Redirect to='/viewCourse' />

    }

    componentWillMount() {
        this.props.dispatch(getNewCourseResponseMessage(''));
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    render() {

        if(this.state.redirect){
            return(<Redirect to={'/'}/>)
        }

        const successMsg = (<div className="alert alert-success" role="alert">Successfully Course Added..</div>);
        const errorMsg = (<div className="alert alert-danger" role="alert">General Application Error</div>);


        return (
            <div>
                {this.props.getNewCourseResponseMessage === 'success' ? successMsg : null}
                {this.props.getNewCourseResponseMessage === 'error' ? errorMsg : null}

                <div className="controls">

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_name">Course Name *</label>
                                <input id="coursename" onChange={this.updateDetails.bind(this)}
                                       type="text" name="coursename" className="form-control"
                                       placeholder="Please enter the course name *" required="required"
                                       data-error="course name is required."/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_lastname">Module Code *</label>
                                <input id="modulecode" onChange={this.updateDetails.bind(this)}
                                       type="text" name="modulecode" className="form-control"
                                       placeholder="Please enter the module code *" required="required"
                                       data-error="module code is required."/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_name">Credits *</label>
                                <select className="form-control" onChange={this.updateDetails.bind(this)}
                                        id="credits">
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_lastname">Duration *</label>
                                <input id="duration" onChange={this.updateDetails.bind(this)}
                                       type="text" name="duration" className="form-control"
                                       placeholder="Please enter the duration in months*" required="required"
                                       data-error="duration is required."/>
                            </div>

                        </div>
                    </div>
                    <div className="row">

                        <div className="col-md-12">
                            <input type="submit" onClick={this.addNewCourse.bind(this)}
                                   className="btn btn-success btn-send" value="Add Course"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        getNewCourseResponseMessage: state.auth.getNewCourseResponseMessage
    }
};

export default connect(mapStateToProps)(addCourse_vm);