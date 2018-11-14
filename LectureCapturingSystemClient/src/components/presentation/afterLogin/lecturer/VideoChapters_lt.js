import React, { Component } from 'react';
import queryString from 'query-string';
import {Redirect} from 'react-router-dom';

// Import functions from service
import { getOneVideo } from "../../../../services/videosService_lt";

class VideoChapters_lt extends Component{
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
        console.log('query parameters');
        console.log(this.props.location.search);
        const queryParameters = queryString.parse(this.props.location.search);
        console.log(queryParameters.lectureVideo);

        // Call function in service
        getOneVideo(queryParameters.lectureVideo).then(data=>{
            this.setState({
                videoList: data
            });
        });
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
                {this.state.videoList.map(video =>
                    <div>
                        <h3> <span className="label label-info">Subject &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> { video.subject } </h3>
                        <h3><span className="label label-info">Video Name:</span> { video.videoName } </h3>
                        <h3><span className="label label-info">Uploaded on:</span> { video.dateTime.substring(4, 24) } </h3>

                        <br/>
                        <h3><b>Video Chapters</b></h3>

                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Video</th>
                                    <th>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                            {video.videoChapters.map(chapter =>
                                <tr>
                                    <td>
                                        <video controls width="300" height="200">
                                            <source src={process.env.PUBLIC_URL + '/videos/' + chapter.videoChapterVideo}/>
                                            Your browser does not support HTML5 video.
                                        </video>
                                    </td>
                                    <td> { chapter.videoChapterText } </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}


            </div>
        )
    }
}

export default VideoChapters_lt;