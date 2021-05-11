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
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
  
  const [ content, setContent ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ percentage, setPersentage ] = useState(0);
  
  const messagesRef = firebase.database().ref("messages");
  const typingRef = firebase.database().ref("typing");
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
      await messagesRef.child(chatRoom.id).push().set(createMessage())

        typingRef.child(chatRoom.id).child(user.uid).remove();

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

  const getPath = () => {
    if(isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`
    } else {
      return `/message/public`
    }
  }

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0];

    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) }
    setLoading(true)
    try {

      // 파일을 스토리지에 저장
      let uploadTask = storageRef.child(filePath).put(file, metadata);
    
      // 파일 저장되는 퍼센티지 구하기
      uploadTask.on("state_changed", 
        UploadTaskSnapshot => {
          const percentage = Math.round(
            (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
          )
          setPersentage(percentage)
        },
        err => {
          console.error(err)
          setLoading(false)
        },
        () => {
          // 저장이 다 된 후에 파일 메세지 전송 (데이터 베이스에 저장)
          // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
          uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            console.log("downloadURL", downloadURL)
            messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
            setLoading(false)
          })
        }
      )

    } catch {
      alert("err"); 
    }
  }

  const handleKeyDown = (event) => {

    if(event.ctrlKey && event.keyCode === 13) {
      handleSubmit();
    }
    if(content) {
      typingRef.child(chatRoom.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(chatRoom.id).child(user.uid).remove();
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            onKeyDown={handleKeyDown}
            value={content}
            onChange={handleChange}
            as="textarea" 
            rows={3} />
        </Form.Group>
      </Form>
      
      {
        !(percentage === 0 || percentage === 100) &&
          <ProgressBar 
            variant="warning" 
            label={`${percentage}%`}
            now={percentage} 
          /> 
      }

      <div>
        {errors.map((errorMsg, i) => 
          <p key={`error${i}`} style={{ color: 'red'}}>{errorMsg}</p>
        )}
      </div>

      <Row>
        <Col>
          <StyledButton onClick={handleSubmit} disabled={loading}>
            SEND
          </StyledButton>
        </Col>
        <Col>
          <StyledButton onClick={handleOpenImageRef} disabled={loading}>
            UPLOAD
          </StyledButton>
        </Col>
      </Row>
      
      {/* file upload input */}
      <input 
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  )
}

export default MessageForm