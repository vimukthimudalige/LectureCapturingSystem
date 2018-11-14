import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class CourseManagement_vm extends Component {

    constructor(props) {
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

    render() {

        if(this.state.redirect){
            return(<Redirect to={'/'}/>)
        }

        if (sessionStorage.getItem("userid")) {
            var userId = sessionStorage.getItem('userid');
        }

        return (
            <div>
                <h3>Course Management</h3>
                <ol className="breadcrumb">
                    <li><Link to={'/courseManagement/viewCourse/'+userId}>View Course</Link></li>
                    <li><Link to={'/courseManagement/addNewCourse/'+userId}>Add New Course</Link></li>
                </ol>

                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default CourseManagement_vm;