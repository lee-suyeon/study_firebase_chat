import { 
  SET_CURRENT_CHAT_ROOM,
  SET_PRIVATE_CHAT_ROOM
} from '../actions/chatRoom_action';

const initialUserState = {
  currentChatRoom: null,
  isPrivateChatRoom: false,
};

const user = (state = initialUserState, action) => {
  switch(action.type){
    case SET_CURRENT_CHAT_ROOM:
    return {
      ...state,
      currentChatRoom: action.payload,
    }
    case SET_PRIVATE_CHAT_ROOM:
    return {
      ...state,
      isPrivateChatRoom: action.payload,
    }
    default:
      return state;
  }
}

export default user;