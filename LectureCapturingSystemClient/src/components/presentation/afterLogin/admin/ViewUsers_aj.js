import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { usersRetrieved } from "../../../../actions/authActions_aj";
import { connect } from "react-redux";
import { getAllUsers } from '../../../../actions/authActions_aj';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import "../../../../css/editUsers.css"
class ViewUsers_aj extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            redirect: false,
            msg: '',
            username: '',
            password: '',
            usertype: '',
            _id: '',
            images: '',
            users: []
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.logChange = this.logChange.bind(this); // We capture the value and change state as user changes the value here.
        // this.handleEdit = this.handleEdit.bind(this); // Function where we submit data
        // this.deleteMember = this.deleteMember.bind(this);
        // this.removeSecond = this.removeSecond.bind(this);

    }

    componentDidMount() {
        fetch('/user/getAllUsers')
            .then(response => {
                return response.json();
            })
            .then(users => {
                this.setState({
                    users: users.data.result
                });
            });
    }


    openModal(users) {
        this.setState({
            modalIsOpen: true,
            username: users.username,
            password: users.password,
            usertype: users.usertype,
            _id: users._id,
            images: users.images
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    logChange(e) {
        this.setState({

            [e.target.name]: e.target.value //setting value edited by the admin in state.
        });
    }

    deleteMember(user, index) {

        if (user != null && index != null) {

            var tempUser = [...this.state.users];
            tempUser.splice(index, 1);
            this.setState({
                users: tempUser
            });

            var data = {
                userid: user._id
            }
            fetch("/user/delete", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Bad response from server");
                }
                return response.json();

            }).catch(function (err) {
                console.log(err)
            });
        }
    }

    // removeSecond(index) {

    //     if (index != null) {
    //         var tempUser = [...this.state.users];
    //         tempUser.splice(index, 1);
    //         this.setState({
    //             users: tempUser
    //         }).bind(this);
    //     }
    // }


    handleEdit(event) {
        //Edit functionality
        event.preventDefault()
        var data = {
            username: this.state.username,
            password: this.state.password,
            usertype: this.state.usertype,
            _id: this.state._id,
            images: this.state.images
        }
        fetch("/user/updateUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("Bad response from server");
            }
            this.setState({
                msg: "User has been edited."
            });
            return response.json();
        }).catch(function (err) {
            console.log(err)
        });
    }

    componentWillMount() {
        if (sessionStorage.getItem("userid")) {

        }
        else {
            this.setState({ redirect: true });
        }
    }

    renderUsers() {


        const noImages = (<td style={{ color: 'red' }}>No Images</td>);

        // const allImagesPath = "../../../../../../allImages/";
        return this.state.users.map((users, index) => {
            return (
                <tr key={users._id}>
                    <td>{index + 1}</td>
                    <td>{users.username}</td>
                    <td>{users.password}</td>
                    <td>{users.usertype}</td>
                    <td>{users.created.substring(0, 10)}</td>
                    {users.images.length == 0 ? noImages : <td>{users.images.map((f, index) => <img className="register" width={50}
                        height={50} key={index} src={"/" + f} />
                    )}</td>}
                    <td><a onClick={() => this.openModal(users)}>Edit</a>|<a onClick={() => this.deleteMember(users, index)}>Delete</a></td>

                </tr>


            );
        })
    }

    render() {

        if (this.state.redirect) {
            return (<Redirect to={'/'} />)
        }

        return (
            <div>

                <table id="example" className="table table-striped table-bordered dt-responsive nowrap">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>User Name</th>
                            <th>Password</th>
                            <th>User Type</th>
                            <th>Created Date</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUsers()}


                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel="Edit Users"
                            className="Modal"
                        // overlayClassName="Overlay" 
                        >
                            <div style={
                                {
                                    padding: '20px 20px 20px 20px'
                                }
                            }>
                                <p style={{ float: "right" }} onClick={this.closeModal}><span className="glyphicon glyphicon-remove"></span></p>
                                <h2 style={{ padding: '0px 0px 5px 0' }} >Edit Users</h2>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.username} name='username' validations={['required']} />
                                </div>
                                <div className="form-group">
                                    <label>Usertype</label>
                                    <input onChange={this.logChange} className="form-control" value={this.state.usertype} name='usertype' validations={['required']} />
                                </div>
                                <div className="form-group">
                                    <label>Enter New Password</label>
                                    <input onChange={this.logChange} className="form-control" placeholder="enter new password.." name='password' validations={['required']} />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input className="form-control" placeholder="confirm password.." name='conPassword' validations={['required']} />
                                </div>

                                <div className="form-group">
                                    <label>Images</label>
                                    <p>{this.state.images.length == 0 ? <p>No Images Found</p> : this.state.images.map((f, index) => <img className="register" width={100}
                                        height={100} key={index} src={"/" + f} />
                                    )}</p>
                                </div>
                                <div className="submit-section">
                                    <button className="btn btn-success btn-send" onClick={this.handleEdit.bind(this)} style={{ float: "right" }}>Update</button>
                                </div>
                            </div>
                        </Modal>
                    </tbody>
                </table>
            </div>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         getAllUsers: state.auth.getAllUsers
//     }
// }
//
// export default connect(mapStateToProps)(ViewUsers_aj);
export default ViewUsers_aj;