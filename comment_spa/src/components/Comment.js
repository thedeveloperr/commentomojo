import React, { Component } from 'react';
import { Grid, Icon } from "semantic-ui-react";

class Comment extends Component {
  toggleUpvote = () =>{
    if (!this.props.upvoted) {
      this.props.upvoteComment(this.props.parentPostId, this.props.id);
    }
    else {
      this.props.removeUpvote(this.props.parentPostId, this.props.id);
    }
  }
  toggleDownvote = () => {
    if (!this.props.downvoted) {
      this.props.downvoteComment(this.props.parentPostId, this.props.id);
    }
    else {
      this.props.removeDownvote(this.props.parentPostId, this.props.id);
    }
  }
  render() {
    return (
      <Grid.Row>
        <Grid.Column width={13}>
          <h5>{this.props.commenterUsername}</h5>
          <p style={{wordBreak: 'break-all',whiteSpace: 'normal'}}>{this.props.text}</p>
        </Grid.Column>
        <Grid.Column textAlign='right' width={3}>
          <div>
            <Icon onClick={() => this.toggleUpvote()}
              name={`thumbs up${this.props.upvoted?'':' outline'}`} 
              color='green' size='large' />
              {this.props.upvotes}
          </div>
          <br/>
          <div>
            <Icon
              onClick={() => this.toggleDownvote()}
              name={`thumbs down${this.props.downvoted ? '' : ' outline'}`} 
              flipped='horizontally'
              color='red' size='large' />
            {this.props.downvotes}
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default Comment;