import React, { Component } from 'react';
import { Form, Modal, Header, Icon, Button } from "semantic-ui-react";
import { connect } from 'react-redux';
import {
  postLoginRequestToServer,
  setLoginSignupRequired
} from '../redux/actions';

class LoginSignupPopup extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };
    }

    handleChange = (e, { name, value }) => this.setState((prevState)=>({ ...prevState, [name]: value }))

    handleSubmit = () => {
      this.props.postComment(this.state.username, this.state.password);
    }
    handleClose = () =>{
      this.props.setLoginSignupRequired(false);
    }
    render() {
        const { username, password } = this.state;
        return (<Modal
        open = { this.props.loginRequired }
        onClose = { this.handleClose }
        basic
        size = 'small'
          >
          <Header icon='key' content='Login To Continue' />
          <Modal.Content>
            <Form inverted onSubmit={this.handleSubmit}>
              <Form.Input onChange={this.handleChange} name='username' value={username} type='text ' label='Username' placeholder='Test Username: test1' required/>
              <Form.Input onChange={this.handleChange} name='password' value={password} type='password ' label='Password' placeholder='TestPassword: testpass1' required/>
              <Form.Button content='Submit' color='red'>Login</Form.Button>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.handleClose} inverted>
              <Icon name='close' /> Cancel
                  </Button>
          </Modal.Actions>
        </Modal>);
    }
}
const mapStateToProps = state => ({
  loginRequired: state.loginRequired
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  postComment: (username, password) => dispatch(postLoginRequestToServer(username, password)),
  setLoginSignupRequired: (payload) => dispatch(setLoginSignupRequired(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignupPopup);