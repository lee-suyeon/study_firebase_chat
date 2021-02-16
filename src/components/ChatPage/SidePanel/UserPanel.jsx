import React from 'react'
import { useSelector } from 'react-redux';

import styled from 'styled-components'
import firebase from '../../../firebase';

import { FiCoffee } from 'react-icons/fi';
import { Dropdown, Image } from 'react-bootstrap';

const Logo = styled.div`
  display: flex;
  align-items: center;
  color: #f7f7e8;
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 0;
  }

  svg {
    font-size: 1.5rem;
    margin-right: 0.3rem;
  }
`

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 30px;
    height: 30px;
    margin-right: 0.3rem;
  }

  .dropdown > button {
    background-color: #557174;
    border-color: #557174;
  }

  .show > .btn-primary.dropdown-toggle,
  .btn-primary:focus, 
  .btn-primary:active {
    background-color: #c7cfb7;
    border-color: #c7cfb7;
  }
`

function UserPanel() {
  const user = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    firebase.auth().signOut();
  }

  return (
    <div>
      {/* Logo */}
      <Logo>
        <FiCoffee />
        <h3>{" "}Chat App</h3>
      </Logo>

      <ProfileWrapper>
        <Image src={user && user.photoURL} roundedCircle />
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ProfileWrapper>
      
    </div>
  )
}

export default UserPanel