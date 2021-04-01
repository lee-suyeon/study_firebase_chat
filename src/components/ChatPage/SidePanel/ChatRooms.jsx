import React, { Component } from 'react'
import styled from 'styled-components'

import { Modal, Button, Form, Badge } from 'react-bootstrap'
import { FiPackage, FiPlus } from 'react-icons/fi'

import { connect } from 'react-redux'
import firebase from '../../../firebase'

import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action'

const ChatRoomList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const ChatRoomTitle = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  .package-icon {
    margin-right: 3px;
  }

  .plus-icon {
    position: absolute;
    right: 0;
    cursor: pointer;
  }
`

class ChatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      description: "",
      chatRoomsRef: firebase.database().ref("chatRooms"),
      messagesRef: firebase.database().ref("messages"),
      chatRooms: [],
      firstLoad: true,
      activeChatRoomId: "",
      notifications: [],
    }
  }

  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
    const { chatRoomsRef, chatRooms, messagesRef } = this.state;

    chatRoomsRef.off();

    chatRooms.forEach(chatRoom => {
      messagesRef.child(chatRoom.id).off();
    })
  }

  setFirstChatRoom = () => {
    const { chatRooms, firstLoad } = this.state;

    const firstChatRoom = chatRooms[0];
    if(firstLoad && chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id })
    }
    this.setState({ firstLoad: false });
  }

  AddChatRoomsListeners = () => {
    let chatRoomArray = [];

    this.state.chatRoomsRef.on("child_added", DataSnapshot => {
      chatRoomArray.push(DataSnapshot.val());

      this.setState({ chatRooms: chatRoomArray }, 
        () => this.setFirstChatRoom());
      this.addNotificationListener(DataSnapshot.key);
    })
  }

  addNotificationListener = (chatRoomId) => {
    const { messagesRef, notifications } = this.state;
    const { chatRoom } = this.props;

    messagesRef.child(chatRoomId).on("value", DataSnapshot => {
      if(chatRoom) {
        this.handleNotification(
          chatRoomId,
          chatRoom.id,
          notifications,
          DataSnapshot
        )
      }
    })
  }

  handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
    let lastTotal = 0;
    // 이미 notifications state안에 알림 정보가 들어있는 채팅방과
    // 그렇지 않은 채팅방을 나눠준다. 
    let index = notifications.findIndex(notification => notification.id === chatRoomId )

    // notifications안에 해당 채팅방의 알림 정보가 없을 때, 
    if(index === -1) {
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.numChildren(),
        lastKnownTotal: DataSnapshot.numChildren(),
        count: 0,
      })
    } else { // notifications안에 해당 채팅방의 알림 정보가 있을 때
      //상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때
      if(chatRoomId !== currentChatRoomId){
        // 현재까지 유저가 확인한 총 메세지 개수
        lastTotal = notifications[index].lastKnownTotal

        //count (알림으로 보여줄 숫자)를 구하기
        // 현재 총 메세지 개수 - 이전에 확인한 총 메세지 개수 > 0
        // 현재 총 메세지 개수가 10개이고 이전에 확인한 메세지 개수가 8개 였다면 2개를 알림으로 보여줘야한다. 
        if(DataSnapshot.numChildren() - lastTotal > 0){
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      }
      // total property에 현재 전체 메세지 개수를 넣어주기
      notifications[index].total = DataSnapshot.numChildren();
    }
    // 채팅룸에 맞는 알림 정보를 넣어주기
    this.setState({ notifications });
  }


  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = e => {
    e.preventDefault();

    const { name, description } = this.state;

    if(this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  }

  addChatRoom = async () => {

    const { name, description, chatRoomsRef } = this.state;
    const key = chatRoomsRef.push().key;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name,
      description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      }
    }

    try {
      await chatRoomsRef.child(key).update(newChatRoom)
      this.setState({
        name: "",
        description: "",
        show: false,
      })
    } catch (errer) {
      alert("error");
    }
  }

  isFormValid = (name, description) => name && description;

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });

    this.clearNotifications();
  }

  clearNotifications = () => {
    const { notifications } = this.state;
    const { chatRoom } = this.props;

    let index = notifications.findIndex(
      notifications => notifications.id === chatRoom.id
    )

    if(index !== -1) {
      let updatedNotifications = [ ...notifications ];
      updatedNotifications[index].lastKnownTotal = notifications[index].total;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  }

  getNotificationCount = (room) => {

    const { notifications } = this.state;

    // 해당 채팅방의 count수를 구한다. 
    let count = 0;

    notifications.forEach(notification => {
      if(notification.id === room.id){
        count = notification.count;
      }
    })

    if(count > 0) return count;
  }

  render () {
    const { show, name, description, chatRooms, activeChatRoomId } = this.state;

    return (
      <div className="chat-rooms">
        <ChatRoomTitle>
          <FiPackage className="package-icon"/>
          CHAT ROOMS{" "} (1)
          <FiPlus
            className="plus-icon"
            onClick={this.handleShow}
          />
        </ChatRoomTitle>

        {/* ChatRoom list */}
        <ChatRoomList>
          {chatRooms.length > 0 && chatRooms.map(room => {
            return (
              <li 
                key={room.id}
                style={{
                  padding: "0 0.5rem",
                  background: room.id === activeChatRoomId && "#c0cca9"}}
                onClick={() => this.changeChatRoom(room)}
              > 
                # {room.name}
                <Badge
                  style={{ float: 'right', marginTop: '4px'}}
                  variant="danger"
                  >
                    {this.getNotificationCount(room)}
                </Badge>
              </li>
            )})
          }
        </ChatRoomList>

        {/* Add chat rooms */}
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter a chat room name" 
                  onChange={(e) => this.setState({ name: e.target.value })}
                  value={name}
                  />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter a chat room description" 
                  onChange={(e) => this.setState({ description: e.target.value })}
                  value={description}
                  />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>


      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  }
}

export default connect(mapStateToProps)(ChatRooms)