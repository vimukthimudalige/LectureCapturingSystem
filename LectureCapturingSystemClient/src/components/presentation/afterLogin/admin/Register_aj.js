import React, { Component} from 'react';
import { submitRegister, getRegsterResponseMessage } from '../../../../actions/authActions_aj';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone'
import { Button,Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import FileUpload from './fileUpload'
import '../../../../css/register.css';
import {Redirect} from 'react-router-dom';

class Register_aj extends Component {

    constructor(){
        super();

        this.state = {
            details:{
            },
            files: [],
            redirect:false
        };

        // this.sendFiles.bind(this);
    }

    onDrop(files) {

        this.setState({
            files
        });
        console.log("files :" + JSON.stringify(files));
        // const filess = { id,1, files : files};
        // console.log(this.state.files);
        // this.updateDetails(filess)
    }

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    register(){
        const imageNames = [];
        let userTypeFound = false;

        this.state.files.map(f =>
            //console.log("inside map() :" + JSON.stringify(f))
            imageNames.push(f.name)

        );
        console.log(" imageNames :" + imageNames);

        if (this.state.details.hasOwnProperty("usertype")) {
            userTypeFound = true;
        }
        this.props.dispatch(submitRegister(this.state.details,imageNames,userTypeFound));
    }

    // sendFiles() {
    //     console.log("sendFiles() ----------");
    //
    //     fetch('/multipleImages').then(response =>{
    //         if (!response.ok) {
    //             console.log("Client().fetchImages().Error");
    //             throw Error(response.statusText);
    //         }
    //         console.log("Client().fetchImages().Success");
    //         return response.json();
    //     })
    //         .then(data=>{
    //
    //         })
    //         .catch( (e) => console.log(e) );
    // }

    componentWillMount() {
        this.props.dispatch(getRegsterResponseMessage(''));
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

        const successMsg = (<div className="alert alert-success" role="alert">Successfully Registered..</div>);
        const errorMsg = (<div className="alert alert-danger" role="alert">General Application Error</div>);


        return (
            <div>
                {/*<h3>Register</h3>*/}
                {/*Username <input onChange={this.updateDetails.bind(this)} id="username" type="text" placeholder= "Username"/><br/>*/}
                {/*Password <input onChange={this.updateDetails.bind(this)} id="password" type="password" placeholder= "Password"/><br/>*/}
                {/*UserType*/}
                {/*<select onChange={this.updateDetails.bind(this)} id="usertype">*/}
                    {/*<option value="admin">Admin</option>*/}
                    {/*<option value="lecturer">Lecturer</option>*/}
                    {/*<option value="student">Student</option>*/}
                {/*</select>*/}
                {/*<button onClick={this.register.bind(this)}>Register</button>*/}
                {this.props.getRegisterResponseMsg === 'success' ? successMsg : null}
                {this.props.getRegisterResponseMsg === 'error' ? errorMsg : null}

                <div className="controls">

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_name">User Name *</label>
                                <input id="username" onChange={this.updateDetails.bind(this)}
                                       type="text" name="name" className="form-control"
                                       placeholder="Please enter the username *" required="required"
                                       data-error="User Name is required."/>
                                    {/*<div className="help-block with-errors"></div>*/}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_lastname">Password *</label>
                                <input id="password" onChange={this.updateDetails.bind(this)}
                                       type="text" name="surname" className="form-control"
                                       placeholder="Please enter the password *" required="required"
                                       data-error="Password is required."/>
                                    {/*<div className="help-block with-errors"></div>*/}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="form_name">User Type *</label>
                                <select className="form-control" onChange={this.updateDetails.bind(this)}
                                        id="usertype">
                                    <option value="admin">Admin</option>
                                    <option value="lecturer">Lecturer</option>
                                    <option value="student">Student</option>
                                </select>
                                {/*<div className="help-block with-errors"></div>*/}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Upload Images *</label>
                            </div>
                            <div className="col-md-2">
                                <Dropzone className="ignore" onDrop={this.onDrop.bind(this)}>
                                    <Button icon>
                                        <Icon name="plus" />
                                    </Button>
                                </Dropzone>
                            </div>

                                    {
                                        this.state.files.map(f => <img className="register" ref="image" width={100}
                                                                       height={100} key={f.name} src={f.preview}/>)
                                    }

                        </div>
                    </div>
                    <div className="row">

                        <div className="col-md-12">
                            <input type="submit" onClick={this.register.bind(this)}
                                   className="btn btn-success btn-send" value="Register"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        getRegisterResponseMsg: state.auth.getRegisterResponseMsg
    }
}

export default connect(mapStateToProps)(Register_aj);