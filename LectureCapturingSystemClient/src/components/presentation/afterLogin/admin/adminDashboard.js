import React, { Component } from 'react';
import '../../../../css/dashboard.css';
import openSocket from 'socket.io-client';
import {config} from '../../../../configurations/config';

class adminDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                pages: {},
                referrers: {},
                activeUsers: 0
            }
        };
    }

    socket = openSocket(config.apiUrl);
    componentDidMount() {
        // const socket = openSocket('http://127.0.0.1:5000');
        // setInterval(() => {
        this.socket.on('updated-stats', function (data) {
            this.setState({
                data: {
                    pages: data.pages,
                    referrers: data.referrers,
                    activeUsers: data.activeUsers
                }
            });

        }.bind(this));


        // }, 3000);

        // console.log("data.pages :" + JSON.stringify(this.state.data.pages));
        // console.log("data.referrers :" + JSON.stringify(this.state.data.referrers));
    }

    componentWillUnmount() {

        this.socket = {};
    }

    render() {

        return (
            <div>
                <h1>Admin Dashboard </h1>
                <div className="row">
                    <div className="col-xs-3">
                        <div className="well">
                            <h1 className="dash-red">{this.state.data.activeUsers} <i className="glyphicon glyphicon-user"></i></h1>
                            <h3 className="text-muted">Active Users</h3>
                        </div>
                    </div>
                    <div className="col-xs-9">
                        <h2 className="sub-header">Active Pages</h2>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <td>Page URL</td>
                                    <td>Active Users</td>
                                </thead>
                                <tbody>

                                    {Object.keys(this.state.data.pages).map((key, i) =>
                                        <tr key={i}>
                                            <td>{key}</td>
                                            <td>{this.state.data.pages[key]}</td>
                                        </tr>
                                    )}


                                </tbody>
                            </table>
                        </div>

                        <h2 className="sub-header">Referrals</h2>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <td>Referring Site</td>
                                    <td>Active Users</td>
                                </thead>
                                <tbody>

                                    {Object.keys(this.state.data.referrers).map((key, i) =>
                                        <tr key={i}>
                                            <td>{key}</td>
                                            <td>{this.state.data.referrers[key]}</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default adminDashboard;