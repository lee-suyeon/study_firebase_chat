import React, { Component } from 'react';
import styled from 'styled-components'

import Message from './Message';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';

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
  render () {
    return (
      <MainWrapper>
        <MessageHeader />
        <MessageWrapper>
          <Message />
        </MessageWrapper>
          <MessageForm />
      </MainWrapper>
    )
  }
}

export default MainPanel