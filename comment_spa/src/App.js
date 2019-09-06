import React from 'react';

import { Container, Menu } from "semantic-ui-react";
import LoginSignupPopup from './components/LoginSignupPopup';
import Logout from './components/Logout';
import CommentBox from './components/CommentBox';
import CommentList from './components/CommentList';
function App() {
  return (
    <Container>
      <Logout/>
      <LoginSignupPopup/>
      <CommentBox/>
      <CommentList/>
    </Container>
  );
}

export default App;
