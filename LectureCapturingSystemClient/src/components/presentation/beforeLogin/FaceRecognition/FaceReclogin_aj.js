import React, {Component} from 'react';
import Authentication from '../../../containers/Authentication_aj';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';

class FaceReclogin_aj extends Component {

    constructor(){
        super();
        this.state = {
            src : {
                imageString : ''
            }
        };

        this.capture.bind(this);
    }


    showImage() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d")
        const img = this.refs.image
        img.onload = () => {
            ctx.drawImage(img, 0, 0)
            // ctx.font = "40px Courier"
            // ctx.fillText(this.props.text, 210, 75)
        }
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        console.log("Image src :" + imageSrc);
        this.setState({
            src :{
                imageString : imageSrc
            }
        });
        console.log("imageString :" + this.state.src.imageString);
        this.showImage();
        this.faceRecognize();

    };

    faceRecognize() {
        fetch('/user/faceLogin',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.src),
            mode: 'cors'
        }).then(response =>{
                return response.json();
            })
            .then(users=>{
                this.setState({
                    // users: users.data.result
                });
            });
    }

    render() {

        return (
            <div>
                <div className="row">>
                <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                />
                <button onClick={this.capture}>Capture photo</button>
                </div>
                <div className="row">>
                    <canvas ref="canvas" width={640} height={425} />
                    <img ref="image" src={this.state.src.imageString} className="hidden" />
                </div>
            </div>


        );
    }
}

export default FaceReclogin_aj;