export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const SET_PHOTO_URL = "SET_PHOTO_URL"

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};

export const setPhotoURL = photoURL => {
  return {
    type: SET_PHOTO_URL,
    payload: photoURL,
  };
}