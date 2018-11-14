import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class AttendanceManagement_aj extends Component {

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
                <h3>Attendance Management</h3>
                <ol className="breadcrumb">
                    {/* <li><Link to={'/attendanceManagement/attendance1/'+userId}>Process1</Link></li> */}
                    <li><Link to={'/attendanceManagement/attendance2/'+userId}>Mark Attendance</Link></li>
                </ol>

                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default AttendanceManagement_aj;