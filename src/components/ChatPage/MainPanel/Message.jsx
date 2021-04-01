import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { Media } from 'react-bootstrap'

const MessageImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`

const Timestamp = styled.span`
  font-size: 10px;
  color: gray;
`

function Message({ message, user }) {

  const timeFromNow = timestamp => moment(timestamp).fromNow();
  
  const isImage = message => {
    return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
  }

  const isMessageMine = (message, user) => {
    if(user) {
      return message.user.id === user.uid
    }
  }

  return (
    <Media style={{ marginBottom: '0.5rem' }}>
      <MessageImage
        src={message.user.image}
        alt={message.user.name}
      />
      <Media.Body 
        style={{ 
          backgroundColor: isMessageMine(message, user) && "#ececec",
          }}>
        <h6>{message.user.name}{" "}
          <Timestamp>
            {timeFromNow(message.timestamp)}
          </Timestamp>
        </h6>
          {isImage(message) ? 
            <img 
              style={{ maxWidth: '300px'}} 
              alt="이미지" 
              src={message.image} 
            /> :
            <p>{message.content}</p>
          }
      </Media.Body>
    </Media>
  )
}

export default Message