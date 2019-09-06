import React, { Component } from 'react';
import { Form, Segment } from "semantic-ui-react";
import { connect } from 'react-redux';
import {
  postCommentToServer
} from '../redux/actions';


class CommentBox extends Component {
  constructor(props){
    super(props);
    this.state = { comment: '' };
  }
 
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.setState({ comment: '' });
    this.props.postComment(this.props.parentPostId, this.state.comment);
  }
  render() {
    const { comment } = this.state;
    return (
      <Segment color="yellow">
        <Form onSubmit={this.handleSubmit}>
          <Form.TextArea
            placeholder='Type Comment here....'
            name='comment'
            value={comment}
            onChange={this.handleChange}
          />
          <Form.Button content='Submit' color='red' >Add Comment</Form.Button>
        </Form>
      </Segment>
    );
  }
}
const mapStateToProps = state => ({
  parentPostId: state.parentPostId
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  postComment: (parentPostId, text) => dispatch(postCommentToServer(parentPostId, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);