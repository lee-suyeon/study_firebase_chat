import React, { Component } from 'react'
import styled from 'styled-components';
import { FiSmile } from 'react-icons/fi'
import firebase from '../../../firebase';
import { connect } from 'react-redux';

import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action'

export class Favorited extends Component {

  state = {
    usersRef : firebase.database().ref("users"),
    favoritedChatRoom: [],
    activeChatRoomId: "",
  }

  componentDidMount() {
    const { user } = this.props;

    if(user) {
      this.addListeners(user.uid)
    }
  }

  componentWillUnmount() {
    const { user } = this.props;

    if(user) {
      this.removeListener(user.uid);
    }
  }

  removeListener = (userId) => {
    const { usersRef } = this.state;

    usersRef.child(userId).child("favorited").off();
  }

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });

  }

  addListeners = (userId) => {
    const { usersRef } = this.state;

    // 좋아요
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_added", DataSnapshot => {
        // 좋아요 누른 채팅방의 정보
        const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val() }
        this.setState({
          favoritedChatRoom: [...this.state.favoritedChatRoom, favoritedChatRoom]
        })
      })

    // 좋아요 취소
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_removed", DataSnapshot => {
        const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val() };
        const filteredChatRooms = this.state.favoritedChatRoom.filter(chatRoom => {
          return chatRoom.id !== chatRoomToRemove.id;
        })
        this.setState({ favoritedChatRoom: filteredChatRooms })
      })

  }

  renderFavoritedChatRooms = (favoritedChatRoom) => 
    favoritedChatRoom.length > 0 &&
    favoritedChatRoom.map(chatRoom => (
      <li 
        key={chatRoom.id}
        onClick={() => this.changeChatRoom(chatRoom)}
        style={{
          backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#c0cca9"
        }}
        >
        # {chatRoom.name}
      </li>
    ))
  


  render () {
    const { favoritedChatRoom } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FiSmile style={{ marginRight: '3px' }}/>
          FAVORITED({favoritedChatRoom.length})
        </span>
        <ul style={{ listStyleType: 'none', padding: '0'}}>
          {this.renderFavoritedChatRooms(favoritedChatRoom)}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(Favorited);