import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import firebase from '../../../firebase'

import { Form, ProgressBar, Row, Col } from 'react-bootstrap'

import mime from 'mime-types'

const StyledButton = styled.button`
  background: #7ebeb6;
  width: 100%;
  color: white;
  text-transform: uppercase;
  border: none;
  margin-top: 30px;
  padding: 18px;
  font-size: 16px;
  font-weight: 200;
  letter-spacing: 10px;

  &:hover {
    background: #509a8f;
  }
`

function MessageForm() {
  const user = useSelector(state => state.user.currentUser);
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const [ content, setContent ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const messagesRef = firebase.database().ref("messages");
  const inputOpenImageRef = useRef();
  const storageRef = firebase.storage().ref();

  const handleChange = e => {
    setContent(e.target.value)
  }

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL
      }
    }

    if(fileUrl !== null){
      message.image = fileUrl;
    } else {
      message.content = content;
    }
    return message;
  }

  const handleSubmit = async () => {
    if(!content){
      setErrors(prev => prev.concat("Type contents first"))
      return;
    }
    setLoading(true);

    // firebase에 메세지 저장
    try {
      await messagesRef
        .child(chatRoom.id)
        .push()
        .set(createMessage())

        setLoading(false);
        setContent("");
        setErrors([]);
    } catch (error) {
      setErrors(prev => prev.concat(error.message))
      setLoading(false);
      setTimeout(() => {
        setErrors([])
      }, 500)
    }
  }

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    const filePath = `/message/public/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) }
    
    try {
      await storageRef.child(filePath).put(file, metadata);
    } catch {
      alert("err");
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control 
            value={content}
            onChange={handleChange}
            as="textarea" 
            rows={3} />
        </Form.Group>
      </Form>
      
      <ProgressBar 
        variant="warning" 
        label="60%"
        now={60} 
      /> 

      <div>
        {errors.map((errorMsg, i) => 
          <p key={`error${i}`} style={{ color: 'red'}}>{errorMsg}</p>
        )}
      </div>

      <Row>
        <Col>
          <StyledButton onClick={handleSubmit}>SEND</StyledButton>
        </Col>
        <Col>
          <StyledButton onClick={handleOpenImageRef}>
            UPLOAD
          </StyledButton>
        </Col>
      </Row>
      
      {/* file upload input */}
      <input 
        type="file"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  )
}

export default MessageForm