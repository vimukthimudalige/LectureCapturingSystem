import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class UserManagement_aj extends Component {

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
                <h3>User Management</h3>
                <ol className="breadcrumb">
                    <li><Link to={'/userManagement/viewUser/'+userId}>View User</Link></li>
                    <li><Link to={'/userManagement/registerUser/'+userId}>Register User</Link></li>
                </ol>

                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default UserManagement_aj;