import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

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
  return (
    <HeaderWrapper>
      <Container>
        <Row>
          <Col>
            <h3>
              {isPrivateChatRoom ? <FiLock /> : <FiUnlock />}
              {chatRoom && chatRoom.name}<FiHeart />
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
              <Image />userName
            </p>
          </AvatarWrapper>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Hello! I'm the body</Card.Body>
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