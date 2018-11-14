import React, { Component } from 'react';

class LiveStream_vr extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-2"></div>
                    <div className="col-xs-8">
                        <h1> Live Stream</h1>
                    </div>
                    <div className="col-xs-2">
                        <h4> Logged in students</h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-1"></div>

                    <div className="col-xs-8">
                        <video width="800" height="400" controls autoPlay>
                            <source src={process.env.PUBLIC_URL + '/videos/testVideo.mp4'}/>
                            Your browser does not support HTML5 video.

                        </video>
                    </div>

                    <div className="col-xs-3">
                        <ul className="list-group">
                            <li className="list-group-item">Jack Robinson <span className="glyphicon glyphicon-ok"></span></li>
                            <li className="list-group-item">Joey Tribiani <span className="glyphicon glyphicon-ok"></span></li>
                            <li className="list-group-item">Rachel Greene <span className="glyphicon glyphicon-ok"></span></li>
                            <li className="list-group-item">Tim Johnson <span className="glyphicon glyphicon-ok"></span></li>
                            <li className="list-group-item">Tom Cruise <span className="glyphicon glyphicon-ok"></span></li>
                            <li className="list-group-item">Megan Fox <span className="glyphicon glyphicon-ok"></span></li>
                        </ul>
                    </div>
                </div>

                <br/>

                <div className="row">
                    <div className="col-xs-3"></div>
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-primary">Rotate Camera</button>
                    </div>
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-success">Give Control</button>
                    </div>

                </div>
            </div>
        )
    }
}

export default LiveStream_vr;