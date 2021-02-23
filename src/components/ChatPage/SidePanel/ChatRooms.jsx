import React, { Component } from 'react'

import { Modal, Button, Form } from 'react-bootstrap'
import { FiPackage, FiPlus } from 'react-icons/fi'

import { connect } from 'react-redux'
import firebase from '../../../firebase'

class ChatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: "",
      description: "",
      chatRoomsRef: firebase.database().ref("chatRooms")
    }
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

  render () {
    const { show, name, description } = this.state;

    return (
      <div>
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center'}}>
          
          <FiPackage style={{ marginRight: 3 }} />
          CHAT ROOMS{" "} (1)

          <FiPlus
            onClick={this.handleShow}
            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          />
        </div>

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
    user: state.user.currentUser
  }
}

export default connect(mapStateToProps)(ChatRooms)