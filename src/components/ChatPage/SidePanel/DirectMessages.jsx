import React, { Component } from 'react'
import styled from 'styled-components'

import { FiSmile } from 'react-icons/fi'
import firebase from '../../../firebase'
import { connect } from 'react-redux'

import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action'

const DirectWrapper = styled.div`

`

const DirectList = styled.ul`
  list-style-type: none;
  padding: 0;
`

export class DirectMessages extends Component {

  state = {
    usersRef: firebase.database().ref("users"),
    users: [],
    activeChatRoom: ""
  }

  componentDidMount() {
    const { user } = this.props;

    this.addUsersListeners(user.uid)
  }

  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;

    let usersArray = [];

    usersRef.on("child_added", DataSnapshot => {
      if(currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val()
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user)
        this.setState({ users: usersArray })
      }
    })
  }

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;

    return userId > currentUserId 
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`
  }

  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name
    }
    this.props.dispatch(setCurrentChatRoom(chatRoomData))
    this.props.dispatch(setPrivateChatRoom(true))
    this.setActiveChatRoom(user.uid);
  }

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId })
  }
  
  renderDirectMessages = (users) => 
    users.length > 0 &&
    users.map(user => (
      <li 
        key={user.uid} 
        style={{
          backgroundColor: user.uid === this.state.activeChatRoom && "#c0cca9"
        }}
        onClick={() => this.changeChatRoom(user)}>
        # {user.name}
      </li>
    ))
  
  render() {
    const { users } = this.state;

    console.log("users", users)
    return (
      <div>
        <DirectWrapper>
          <FiSmile /> DIRECT MESSAGES(1)
        </DirectWrapper>

        <DirectList>
          {this.renderDirectMessages(users)}
        </DirectList>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}


export default connect(mapStateToProps)(DirectMessages)