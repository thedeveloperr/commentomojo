import React, { Component } from 'react';
import { Grid, Segment } from "semantic-ui-react";
import { connect } from 'react-redux';
import {
  putUpvoteOnServer,
  deleteUpvoteFromServer,
  putDownvoteOnServer,
  deleteDownvoteFromServer,
  fetchComments
} from '../redux/actions';

import Comment from './Comment';

class CommentList extends Component {
  componentDidMount() {
    console.log("this.props");
    this.props.fetchComments(this.props.parentPostId);
  }
  render() {
    return (<Segment loading={this.props.fetching}>
      <Grid padded>
        {
          this.props.comments.map((comment) =>{
            const votingPropsMethods = {
              parentPostId: this.props.parentPostId,
              upvoteComment: this.props.upvoteComment,
              removeUpvote: this.props.removeUpvote,
              downvoteComment: this.props.downvoteComment,
              removeDownvote: this.props.removeDownvote
            }
            return <Comment key={comment.id} {...votingPropsMethods} {...comment} />
          }).reverse()
        }
      </Grid>
    </Segment>)
  }
}
const mapStateToProps = state => ({
  comments: state.comments,
  parentPostId: state.parentPostId,
  fetching: state.fetchingComments
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  upvoteComment: (parentPostId, commentId) => dispatch(putUpvoteOnServer(parentPostId,commentId)),
  downvoteComment: (parentPostId, commentId) => dispatch(putDownvoteOnServer(parentPostId, commentId)),
  removeUpvote: (parentPostId, commentId) => dispatch(deleteUpvoteFromServer(parentPostId, commentId)),
  removeDownvote: (parentPostId, commentId) => dispatch(deleteDownvoteFromServer(parentPostId, commentId)),
  fetchComments: (parentPostId) => dispatch(fetchComments(parentPostId,1,1000))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);