import React, { Component } from 'react'
import styled from 'styled-components'

import { FiSmile } from 'react-icons/fi'
import firebase from '../../../firebase'
import { connect } from 'react-redux'

const DirectWrapper = styled.div`

`

const DirectList = styled.ul`
  list-style-type: none;
  padding: 0;
`

export class DirectMessages extends Component {

  state = {
    usersRef: firebase.database().ref("users")
  }

  componentDidMount() {
    const { user } = this.props;

    this.addUsersListeners(user.uid)
  }

  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;

    let usersArray = [];

    usersRef.on("child_added", DataSnapshot => {
      if(currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val()
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user)
        this.setState({ users: usersArray })
      }
    })
  }

  
  renderDirectMessages = () => {
    
  }
  
  render() {
    return (
      <div>
        <DirectWrapper>
          <FiSmile /> DIRECT MESSAGES(1)
        </DirectWrapper>

        <DirectList>
          {this.renderDirectMessages()}
        </DirectList>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser
  }
}


export default connect(mapStateToProps)(DirectMessages)