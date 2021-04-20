export const SET_CURRENT_CHAT_ROOM = "SET_CURRENT_CHAT_ROOM";
export const SET_PRIVATE_CHAT_ROOM = "SET_PRIVATE_CHAT_ROOM";
export const SET_USER_POSTS = "SET_USER_POSTS"

export const setCurrentChatRoom = (room) => {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: room,
  };
};

export const setPrivateChatRoom = (isPrivateChatRoom) => {
  return {
    type: SET_PRIVATE_CHAT_ROOM,
    payload: isPrivateChatRoom
  }
}

export const setUserPosts = (userPosts) => {
  return {
    type: SET_USER_POSTS,
    payload: userPosts
  }
}