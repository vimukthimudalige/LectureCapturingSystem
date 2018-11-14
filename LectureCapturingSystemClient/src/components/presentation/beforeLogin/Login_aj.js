import React, { Component } from 'react';
import { getRegsterResponseMessage, submitLogin, userLoggedIn } from '../../../actions/authActions_aj';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../../css/loginForm_aj.css';
import avatar from '../../../css/images/avatar.png';
import Webcam from 'react-webcam';
import { isNull } from 'util';
import {config} from '../../../configurations/config';

class Login_aj extends Component {

    constructor() {
        super();

        this.state = {
            authentication: false,
            faceLoginError: false,
            details: {
            },
            // src : {
            //     imageString : ''
            // },
            allowWebcam: false
        };

        this.confirmBox.bind(this);
        this.capture.bind(this);
        this.faceLoginButtonClick.bind(this);
        // this.faceRecognize.bind(this);
    }

    // componentDidMount() {
    //     setTimeout(this.confirmBox.bind(this), 1500)

    //     // fetch('/face/user')
    //     //     .then(response =>{
    //     //         return response.json();
    //     //     })
    //     //     .then(data=>{
    //     //         // this.setState({
    //     //         //     users: users.data.result
    //     //         // });
    //     //         console.log(data.toString());
    //     //
    //     //     });
    // }

    confirmBox() {
        if (window.confirm("Allow Webcam?")) {
            this.setState({
                allowWebcam: true
            });
            console.log("this.state.allowWebcam" + this.state.allowWebcam)
        }
    }

    updateDetails(event) {
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    login() {
        this.props.dispatch(submitLogin(this.state.details));
    }

    // showImage() {
    //     const canvas = this.refs.canvas;
    //     const ctx = canvas.getContext("2d")
    //     const img = this.refs.image
    //     img.onload = () => {
    //         ctx.drawImage(img, 0, 0)
    //         // ctx.font = "40px Courier"
    //         // ctx.fillText(this.props.text, 210, 75)
    //     }
    // }

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

    faceLoginButtonClick = () => {
        this.setState({
            faceLoginError: false,
            authentication: true
        });
        fetch('/user/loginNew')
            .then(response => {
                if (!response.ok) {
                    console.log("Client().faceRecognize().Error :" + response.statusText);
                    this.setState({
                        authentication : false,
                        faceLoginError: true
                    });
                    throw Error(response.statusText);
                }
                console.log("Client().faceRecognize().Success");
                return response.json();
            })
            .then(data => {
                sessionStorage.setItem('username', data.data.username);
                sessionStorage.setItem('token', data.data.tokenID);
                console.log("submitLogin().usertype : " + data.data.usertype);
                sessionStorage.setItem('usertype', data.data.usertype);
                sessionStorage.setItem('userid', data.data.userid);
                this.props.dispatch(userLoggedIn(data.data.username, data.data.usertype));

            })
            .catch((e) => console.log(e));
    }

    // faceRecognize(base64) {
    //     fetch('/user/faceLogin', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(base64),
    //         mode: 'cors'
    //     }).then(response => {
    //         if (!response.ok) {
    //             console.log("Client().faceRecognize().Error :" + response.statusText);
    //             this.setState({
    //                 faceLoginError: true
    //             });
    //             throw Error(response.statusText);
    //         }
    //         console.log("Client().faceRecognize().Success");
    //         return response.json();
    //     })
    //         .then(data => {
    //             sessionStorage.setItem('username', data.data.username);
    //             sessionStorage.setItem('token', data.data.tokenID);
    //             console.log("submitLogin().usertype : " + data.data.usertype);
    //             sessionStorage.setItem('usertype', data.data.usertype);
    //             sessionStorage.setItem('userid', data.data.userid);
    //             this.props.dispatch(userLoggedIn(data.data.username, data.data.usertype));

    //         })
    //         .catch((e) => console.log(e));
    // }


    render() {
        const faceAlert = (<div className="alert alert-danger" role="alert">Face not recognized! Please try again!</div>);
       
        const AuthenticatingAlert = (<div className="alert alert-success" role="alert">Authenticating...Please wait...</div>);

        return (
            <div>

                <div className="col-md-4">
                    {/* {this.state.allowWebcam === true ? webcamCode : null} */}
                    <div className="webcam">
                        {/*<img src="http://localhost:5004/video_feed" width="490" height="350"></img>*/}
                        <img src={config.pythonServerUrl} width="490" height="350"></img>
                        <button onClick={this.faceLoginButtonClick}
                            className="btn btn-primary btn-lg btn-block">Face Login</button>
                        <div style={{ margin: '0 0 0 15%' }}>
                        {this.state.faceLoginError === true ? faceAlert : null}
                        {this.state.authentication === true ? AuthenticatingAlert : null}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="login-form">
                        <div className="form">
                            <div className="avatar">
                                <img src={avatar} alt="Avatar" />
                            </div>
                            <h2 className="text-center">Login</h2>
                            <div className="form-group">
                                <input type="text" onChange={this.updateDetails.bind(this)}
                                    className="form-control" id="username" placeholder="Username"
                                    required="required" />
                            </div>
                            <div className="form-group">
                                <input type="password" onChange={this.updateDetails.bind(this)}
                                    className="form-control" id="password" placeholder="Password"
                                    required="required" />
                            </div>
                            <div className="form-group">
                                <button onClick={this.login.bind(this)}
                                    className="btn btn-primary btn-lg btn-block">Sign in</button>
                            </div>
                            <div className="clearfix">
                                <label className="pull-left checkbox-inline"><input type="checkbox" /> Remember me</label>
                                <a href="#" className="pull-right">Forgot Password?</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(Login_aj);