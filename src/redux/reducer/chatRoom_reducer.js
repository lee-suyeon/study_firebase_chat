import { 
  SET_CURRENT_CHAT_ROOM
} from '../actions/chatRoom_action';

const initialUserState = {
  currentChatRoom: null
};

const user = (state = initialUserState, action) => {
  switch(action.type){
    case SET_CURRENT_CHAT_ROOM:
    return {
      ...state,
      currentChatRoom: action.payload,
    }
    default:
      return state;
  }
}

export default user;