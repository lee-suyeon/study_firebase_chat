import React, { Component } from 'react'

import { Modal, Button, Form } from 'react-bootstrap'
import { FiPackage, FiPlus } from 'react-icons/fi'

class ChatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render () {
    const { show } = this.state;

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
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control type="text" placeholder="Enter a chat room name" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control type="text" placeholder="Enter a chat room description" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>


      </div>
    )
  }
}

export default ChatRooms