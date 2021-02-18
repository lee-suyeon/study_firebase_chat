import { 
  SET_USER,
  CLEAR_USER,
  SET_PHOTO_URL,
} from '../actions/user_action';

const initialUserState = {
  currentUser: null,
  isLoading: true, // 로그인이 시작되면 로딩중(true) -> 로그인이 끝나면 false
};

const user = (state = initialUserState, action) => {
  switch(action.type){
    case SET_USER:
    return {
      ...state,
      currentUser: action.payload,
      isLoading: false,
    }
    case CLEAR_USER:
    return {
      ...state,
      currentUser: null,
      isLoading: false,
    }
    case SET_PHOTO_URL:
    return {
      ...state,
      currentUser: { ...state.currentUser, photoURL: action.payload },
      isLoading: false,
    }
    default:
      return state;
  }
}

export default user;