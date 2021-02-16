import React from 'react'
import styled from 'styled-components'

import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

const SideWrapper = styled.div`
  min-height: 100vh;
  min-width: 275px;
  background-color: #a1cae2;
  color: white;
  padding: 2rem;
`

function SidePanel() {
  return (
    <SideWrapper>
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessages />
    </SideWrapper>
  )
}

export default SidePanel;