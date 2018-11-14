import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';

// Import configuration file
import { config } from "../../../../configurations/config";

// Import methods from service
import { getAllVideos } from "../../../../services/videosService_lt";
import { createVideoChaptersService } from "../../../../services/videosService_lt";

// Import css stylesheet
import './../../../../css/LectureVideos_lt.css';

class LectureVideos_lt extends Component{
    constructor(props){
        super(props);

        // Initially the list is empty
        this.state = {
            redirect:false,
            videoList : []
        };

    }

    // Execute after the component has been rendered to the DOM
    componentDidMount() {
        getAllVideos().then(data=>{
            this.setState({
                videoList: data
            });
        });
    }

    // Function to create video chapters
    createVideoChapters(lectureVideo) {
        console.log('clicked');
        console.log(lectureVideo);

        createVideoChaptersService(lectureVideo).then(data=> {
            console.log('done');
            console.log(data);

            if(data.success === true)
            {
                alert("Success");
            }
            else
            {
                alert("Failed");
            }
        })

    }

    componentWillMount() {
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

        return (
            <div className="row">
                <div className="col-3"> </div>

                <div className="col-6">
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Video Name</th>
                            <th>Video</th>
                            <th>Date Uploaded</th>
                            <th>Action</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.videoList.map(video =>
                            <tr>
                                <td>{ video.subject }</td>
                                <td>{ video.videoName }</td>
                                <td>
                                    <video controls width="300" height="200">
                                        <source src={process.env.PUBLIC_URL + '/videos/' + video.lectureVideo}/>
                                        Your browser does not support HTML5 video.

                                    </video>
                                </td>

                                <td>{ video.dateTime.substring(4, 24) }</td>

                                {/*{(() => {
                                    switch (video.status) {
                                        case "unprocessed":
                                            return <td>
                                             <button type="button" className="btn btn-primary" onClick={() => this.createVideoChapters(video.lectureVideo)}>
                                                 Create Chapters
                                             </button>
                                            </td>;
                                        case "processed":
                                            return <td>
                                                <Link to={'/videoChapters/:userid?lectureVideo=' + video.lectureVideo} className="btn btn-success">
                                                    View Chapters
                                                </Link>
                                            </td>;
                                        default:
                                            return <td></td>;
                                    }
                                })()}*/}

                                { video.lectureVideo.substring(14, 18) === 'lcs_'
                                    ? <td> </td>
                                    : [
                                        (video.status === 'unprocessed' ?
                                                <td>
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={() => this.createVideoChapters(video.lectureVideo)}>Create
                                                        Chapters
                                                    </button>
                                                </td>
                                                :
                                                <td>
                                                    <Link to={'/videoChapters/:userid?lectureVideo=' + video.lectureVideo} className="btn btn-success">View
                                                        Chapters</Link>
                                                </td>
                                        )

                                    ]
                                }

                                {/*Display different buttons depending on processed status*/}
                                {/*{video.status === 'unprocessed' ?
                                    <td>
                                        <button type="button" className="btn btn-primary"
                                                onClick={() => this.createVideoChapters(video.lectureVideo)}>Create
                                            Chapters
                                        </button>
                                    </td>
                                    :
                                    <td>
                                        <Link to={'/videoChapters/:userid?lectureVideo=' + video.lectureVideo} className="btn btn-success">View
                                            Chapters</Link>
                                    </td>
                                }*/}

                                <td>{ video.status }</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="col-3"> </div>
            </div>

        )
    }

}

export default LectureVideos_lt;