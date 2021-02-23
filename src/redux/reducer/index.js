import { combineReducers } from 'redux';
import user from '../reducer/user_reducer';
import chatRoom from './chatRoom_reducer';

const rootReducer = combineReducers({
  user,
  chatRoom,
})

export default rootReducer;