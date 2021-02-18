import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action'

import styled from 'styled-components'
import firebase from '../../../firebase';

import { FiCoffee } from 'react-icons/fi';
import { Dropdown, Image } from 'react-bootstrap';
import mime from 'mime-types';

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
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const inputOpenImageRef = useRef(null);

  const handleLogout = () => {
    firebase.auth().signOut();
  }

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    const metadata = { contentType: mime.lookup(file.name) };

    
    try {
      
      // storage에 파일 저장
      let uploadTaskSnapshot = await firebase.storage().ref()
        .child(`user_image/${user.uid}`)
        .put(file, metadata)

      let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

      // 프로필 이미지 수정 
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL
      })
      
      // 리덕스 프로필 정보 업데이트
      dispatch(setPhotoURL(downloadURL))

      // 데이터 베이스 유저 이미지 수정
      await firebase.database().ref("users")
        .child(user.uid)
        .update({ image: downloadURL })

    } catch(error) {
      alert(error)
    }
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
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ProfileWrapper>

      <input
        onChange={handleUploadImage}
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        ref={inputOpenImageRef}
      />
      
    </div>
  )
}

export default UserPanel