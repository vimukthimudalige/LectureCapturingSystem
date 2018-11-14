import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Bandwidth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to={'/'} />)
        }

        return (
            <div>
                <h3>Bandwidth Management</h3>

                <div>
                    <video id="videoPlayer" controls>
                        <source src="http://localhost:3000/bandwidth/video" type="video/mp4"/>
                    </video>
                </div>

            </div>
        )
    }
}

export default Bandwidth;