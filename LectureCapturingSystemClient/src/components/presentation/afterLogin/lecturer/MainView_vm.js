import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import Iframe from 'react-iframe'

// Import services
import {recalibrateCamera, turnDownCamera, turnRightCamera, turnUpCamera} from "../../../../services/ptzService_vm";
import { turnLeftCamera, go_to_podium } from "../../../../services/ptzService_vm";
import { stopMovementCamera } from "../../../../services/ptzService_vm";
import { zoomInCamera, zoomOutCamera, turn_to_audience } from "../../../../services/ptzService_vm";
import { runTrackerScript, startLectureTracker,stopTracker, startGestureDetection, saveIPStream } from "../../../../services/ptzService_vm";
import {config} from "../../../../configurations/config";
class MainView_vm extends Component {

    constructor(props){
        super(props);
        this.state = {
            redirect:false
        };
    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    recalibrateCamera() {
        recalibrateCamera().then(data=> {
            console.log('done');
            console.log(data);
            /*if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                //alert("Failed");
            }*/
        })
    }

    go_to_podium() {
        go_to_podium().then(data=> {
            //console.log('done');
            //console.log(data);
            if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    turnLeftCamera() {
        turnLeftCamera().then(data=> {
            //console.log('done');
            //console.log(data);
            /*if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                //alert("Failed");
            }*/
        })
    }

    turnRightCamera() {
        turnRightCamera().then(data=> {
            //console.log('done');
            //console.log(data);
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    turnUpCamera() {
        turnUpCamera().then(data=> {
            //console.log('done');
            //console.log(data);
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    turnDownCamera() {
        turnDownCamera().then(data=> {
            //console.log('done');
            //console.log(data);
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    zoomInCamera() {
        zoomInCamera().then(data=> {
            //console.log(data);
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    zoomOutCamera() {
        zoomOutCamera().then(data=> {
            //console.log(data);
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    stopMovementCamera() {
        stopMovementCamera().then(data=> {
            //console.log('done');
            //console.log(data);
            if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    turn_to_audience() {
        turn_to_audience().then(data=> {
            if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    startLectureTracker() {
        startLectureTracker().then(data=> {
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    startGestureDetection() {
        startGestureDetection().then(data=> {
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    stopTracker() {
        stopTracker().then(data=> {
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }

    saveIPStream() {
        saveIPStream().then(data=> {
            if(data.success === true)
            {
                //alert("Success");
            }
            else
            {
                //alert("Failed");
            }
        })
    }


    runTrackerScript() {
        runTrackerScript().then(data=> {
            if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                alert("Failed");
            }
           //alert('Done');
        })
    }

    render() {
        if(this.state.redirect){
            return(<Redirect to={'/'}/>)
        }

        return (
            <div>
                <h3>Advanced Controls</h3>

                {/*for design testing*/}
                {/*<div className="col s6 center">*/}
                    {/*<video width="600" height="300" autoPlay>*/}
                        {/*<source src={process.env.PUBLIC_URL + '/videos/DemoLeftRightv.mp4'}/>*/}
                    {/*</video>*/}
                {/*</div>*/}


                <div className="row">
                    <div className="col s6 center">

                        <div className="row">
                            <div className="col-xs-1"></div>

                            <div className="col-xs-11">

                                <Iframe url={config.kurentoUrl}
                                        width="700"
                                        height="250"
                                        id="myId"
                                        className="myClassname"
                                        display="initial"
                                        position="relative"
                                        allowFullScreen/>

                            </div>
                        </div>


                        <table className="table-move">
                            <tr>
                                <td></td>
                                <td>
                                  <button id="btnMoveUp" className="btn btn-primary" onClick={this.turnUpCamera}>  Up   </button>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <button id="btnMoveLeft" className="btn btn-primary" onClick={this.turnLeftCamera}>Left</button>
                                </td>
                                <td>

                                </td>
                                <td>
                                    <button id="btnMoveRight" className="btn btn-primary" onClick={this.turnRightCamera}>Right</button>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button id="btnMoveDown" className="btn btn-primary" onClick={this.turnDownCamera}>Down</button>
                                </td>
                                <td></td>

                            </tr>


                        </table>
                    </div>

                    <br/><br/>


                    <div className="col s6 center">
                    <td></td>
                    <td>
                        <button id="btnMoveDown" className="btn btn-warning" onClick={this.zoomInCamera}>Zoom In</button> &nbsp;&nbsp;
                    </td>
                    <td></td>

                    <td></td>
                    <td>
                        <button id="btnMoveDown" className="btn btn-warning" onClick={this.zoomOutCamera}>Zoom Out</button> &nbsp;&nbsp;
                    </td>
                    <td></td>
                    </div>
                    <br/><br/>
                    <div className="col s6 center">
                        <button id="btnRefresh" className="btn btn-success"
                                onClick={this.recalibrateCamera}>Recalibrate</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-success" onClick={this.turn_to_audience}>Turn to Audience</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-success" onClick={this.recalibrateCamera}>Turn Back to Lecturer</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-info" onClick={this.go_to_podium}>Go To Podium</button>&nbsp;&nbsp;
                        <button id="btnClear" className="btn btn-danger" onClick={this.stopMovementCamera}>Stop</button>
                    </div>

                    <br/>
                    <br/>
                    <div className="col s6 center">
                        <button id="btnRefresh" className="btn btn-success" onClick={this.startLectureTracker}>Start Lecturer Tracker</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-success" onClick={this.startGestureDetection}>Start Gesture Detection</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-danger" onClick={this.stopTracker}>Stop Tracker</button>&nbsp;&nbsp;
                        <button id="btnRefresh" className="btn btn-info" onClick={this.saveIPStream}>Save Stream</button>&nbsp;&nbsp;
                        <button id="btnClear" className="btn btn-info" onClick={this.runTrackerScript}>Keypress Camera Move</button>
                    </div>
                </div>


            </div>
        )
    }
}

export default MainView_vm;