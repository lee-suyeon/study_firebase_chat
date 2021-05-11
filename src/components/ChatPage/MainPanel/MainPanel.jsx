import React, { Component } from 'react';
import styled from 'styled-components'

import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

import Message from './Message';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';

import Skeleton from '../../../commons/components/Skeleton'

const MainWrapper = styled.div`
  padding: 2rem 2rem 0 2rem;
`

const MessageWrapper = styled.div`
  width: 100%;
  height: 450px;
  border: 0.2rem solid #eae3c8;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
`

export class MainPanel extends Component {

  messageEndRef = React.createRef();

  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    typingRef: firebase.database().ref("typing"),
    messagesLoading: true,
    searchTerm: "",
    searchLoading: true,
    searchResults: [],
    typingUsers: [],
    listenerLists: [],
  }

  componentDidMount() {
    const { chatRoom } = this.props;
    
    if(chatRoom) {
      this.addMessagesListeners(chatRoom.id);
      this.addTypingListeners(chatRoom.id);
    }
  }

  componentDidUpdate() {
    if(this.messageEndRef) {
      this.messageEndRef.scrollIntoView({
        behavior: "smooth"
      })
    }
  }

  componentWillUnmount() {
    const { chatRoom } = this.props;
    const { messagesRef, listenerLists } = this.state;

    messagesRef.off();
    this.removeListeners(listenerLists);
  }

  removeListeners = (listeners) => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event)
    })
  }

  addTypingListeners = (chatRoomId) => {
    const { typingRef } = this.state;

    let typingUsers = [];
    // 타이핑이 새로 들어올 때
    typingRef.child(chatRoomId).on("child_added", DataSnapshot => {
      if(DataSnapshot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          name: DataSnapshot.val()
        });
        this.setState({ typingUsers })
      }
    })

    // listenersList state에 등록된 리스너를 넣어주기
    this.addToListenerLists(chatRoomId, typingRef, "child_added")

    // 타이핑을 지워줄 때
    typingRef.child(chatRoomId).on("child_removed", DataSnapshot => {
      const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
      if(index !== -1){
        typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
        this.setState({ typingUsers });
      }
    })

    // listenersList state에 등록된 리스너를 넣어주기
    this.addToListenerLists(chatRoomId, typingRef, "child_removed")
  }

  addToListenerLists = (id, ref, event) => {
    const { listenerLists } = this.state;
    
    // 이미 등록된 리스너인지 확인
    const index = listenerLists.findIndex(listener => {
      return (
        listener.id === id &&
        listener.ref === ref &&
        listener.event === event
      )
    })

    // 새로운 이벤트 등록
    if(index === -1){
      const newListener = { id, ref, event }
      this.setState({
        listenerLists: listenerLists.concat(newListener)
      })
    }
  }

  handleSearchMessages = () => {
    const chatRoomMessages = [ ...this.state.messages ];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if(
        (message.content && message.content.match(regex)) ||
        (message.user.name.match(regex))
      ){
        acc.push(message)
      }
      return acc;
    }, [])
    this.setState({ searchResults })
  }

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages())
    
  }
  
  addMessagesListeners = (chatRoomId) => {
    const { messagesRef } = this.state;
    let messagesArray = [];

    messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
      messagesArray.push(DataSnapshot.val());
      this.setState({ 
        messages: messagesArray,
        messagesLoading: false
      });
      this.userPostsCount(messagesArray)
    })
  }

  userPostsCount = (messagesArray) => {
    let userPosts = messagesArray.reduce(( acc, message ) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        }
      }
      console.log('acc', acc)
      return acc;
    }, {})
    this.props.dispatch(setUserPosts(userPosts));
  }

  renderMessages = (messages) => 
    messages.length > 0 &&
    messages.map((message) => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.props.user}
        />
  ))

  renderTypingUsers = (typingUsers) => 
    typingUsers.length > 0 &&
    typingUsers.map(user => (
      <span key={user.name}>{user.name}님이 입력중...</span>
    ))

  renderMessageSkeleton = (loading) => 
    loading && (
      <>
        {[...Array(10)].map((v, i) => (
          <Skeleton key={i}/>
        ))}
      </>
    )  
  
  render () {
    const { messages, searchTerm, searchResults, typingUsers, messagesLoading } = this.state;
    return (
      <MainWrapper>
        <MessageHeader 
          handleSearchChange={this.handleSearchChange}
        />
        <MessageWrapper>

          {this.renderMessageSkeleton(messagesLoading)}

          {searchTerm ?
            this.renderMessages(searchResults) :
            this.renderMessages(messages)
          }
          {this.renderTypingUsers(typingUsers)}
          <div ref={node => (this.messageEndRef = node)}/>
        </MessageWrapper>
          <MessageForm />
      </MainWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  }
}

export default connect(mapStateToProps)(MainPanel)