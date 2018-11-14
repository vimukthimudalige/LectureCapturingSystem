import React, {Component} from 'react';
import Photo from '../Photo';
import FaceReclogin_aj from './FaceReclogin_aj';

class FaceLogin extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <FaceReclogin_aj />
                </div>

                <div className="row">
                    {/*<Photo imageSrc={}/>*/}
                </div>
            </div>
        )
    }
}

export default FaceLogin;