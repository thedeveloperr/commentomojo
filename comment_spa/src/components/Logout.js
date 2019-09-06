
import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import { connect } from 'react-redux';
import {
  logout
} from '../redux/actions';


class Logout extends Component {

  logout = () => {
    this.props.logout();
  }
  render() {
    return (
      this.props.show !== ""?
      <Menu>
        <Menu.Item name='logout' onClick={()=>this.logout()}> Logout</Menu.Item>
      </Menu>: <div></div>
    );
  }
}
const mapStateToProps = state => ({
  show: state.username,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);