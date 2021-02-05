import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

import firebase from './firebase';

function App(props) {
  let history = useHistory();
  
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user", user);
      // 로그인이 된 상태
      if(user){
        history.push("/");
      } else { // 로그인이 안 된 상태
        history.push("/login");
      }
    });
  }, [])

  return (
    <Switch>
      <Route exact path="/" component={ChatPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
    </Switch>
  );
}

export default App;
