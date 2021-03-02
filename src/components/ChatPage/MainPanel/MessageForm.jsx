import React from 'react'
import styled from 'styled-components'

import { Form, ProgressBar, Row, Col } from 'react-bootstrap'

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
  return (
    <div>
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      
      <ProgressBar 
        variant="warning" 
        label="60%"
        now={60} 
      /> 

      <Row>
        <Col>
          <StyledButton>SEND</StyledButton>
        </Col>
        <Col>
          <StyledButton>UPLOAD</StyledButton>
        </Col>
      </Row>
    </div>
  )
}

export default MessageForm