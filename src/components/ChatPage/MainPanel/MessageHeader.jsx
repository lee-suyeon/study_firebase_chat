import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import firebase from '../../../firebase'

import { 
  Container, 
  Row, 
  Col, 
  InputGroup, 
  FormControl, 
  Image,
  Accordion,
  Card,
  Button,
  Media,
} from 'react-bootstrap'
import { FiLock, FiUnlock, FiHeart, FiSearch } from 'react-icons/fi'

const HeaderWrapper = styled.div`
  width: 100%;
  height: 170px;
  border: 0.2rem solid #ececec;
  borderRadius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
  const user = useSelector(state => state.user.currentUser);
  const userPosts = useSelector(state => state.chatRoom.userPosts);

  const [ isFavorited, setIsFavorited ] = useState(false);
  const usersRef = firebase.database().ref("users");

  useEffect(() => {
    if(chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }

  }, [])

  const addFavoriteListener = (chatRoomId, userId) => {
    usersRef
      .child(userId)
      .child("favorited")
      .once("value")
      .then(data => {
        if(data.val() !== null){
          // chatRoomIds : 좋아요를 누른 채팅방의 id
          // data.val() : 좋아요를 누른 채팅방 정보
          const chatRoomIds = Object.keys(data.val()); 
          
          const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
          setIsFavorited(isAlreadyFavorited) 
        }
      })
  }

  const handleFavorite = () => {
    if(isFavorited) {
      usersRef
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove(err => {
          if(err !== null) {
            console.error(err)
          }
        })
        setIsFavorited(prev => !prev);
    } else {
      usersRef
      .child(`${user.uid}/favorited`)
      .update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image
          }
        }
      })
      setIsFavorited(prev => !prev);
    }
  }

  const renderUserPosts = (userPosts) => 
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, value], i) => (
        <Media key={`user${i}`}>
          <img 
            src={value.image}
            style={{ borderRadius: 25 }}
            width={48}
            height={48}
            className="mr-3"
            alt={value.name}
          />
          <Media.Body>
            <h6>{key}</h6>
            <p>
              {value.count} 개
            </p>
          </Media.Body>
        </Media>
  ))
  

  return (
    <HeaderWrapper>
      <Container>
        <Row>
          <Col>
            <h3>
              {isPrivateChatRoom ? <FiLock /> : <FiUnlock />}
              {chatRoom && chatRoom.name}
              {!isPrivateChatRoom &&
              <span style={{ cursor: 'pointer'}} onClick={handleFavorite}>
                {isFavorited ? <FiHeart style={{ fill: 'black' }}/> : <FiHeart />}
              </span>
              }
            </h3>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1"><FiSearch /></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
          <AvatarWrapper>
            <p>
              <Image 
                src={chatRoom && chatRoom.createdBy.image}
                roundedCircle
                style={{ width: '30px', height: '30px' }}
              />
              {" "}
              {chatRoom && chatRoom.createdBy.name}
            </p>
          </AvatarWrapper>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Posts Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {userPosts && renderUserPosts(userPosts)}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </HeaderWrapper>
  )
}

export default MessageHeader