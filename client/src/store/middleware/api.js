import axios from "axios";
import { apiCallBegan, apiCallFailed, apiCallSuccess } from "../api";
import { userLogout } from "../auth";

const baseURL = `${process.env.REACT_APP_API_URI}/api/v1`;

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== apiCallBegan.type) return next(action);

    const {
      url,
      data,
      onSuccess,
      onError,
      method,
      onStart,
      onSuccessAlert,
      onFailedAlert,
    } = action.payload;

    const { userInfo } = getState().auth;

    if (userInfo || url.startsWith("/auth")) {
      if (onStart) dispatch({ type: onStart });

      next(action);

      try {
        const headers = userInfo
          ? { "Content-Type": "application/json" }
          : { "Content-Type": "application/json" }; // Adjust headers based on your needs

        if (userInfo && userInfo.cookie) {
          headers.cookie = userInfo.cookie; // Set the cookie in the headers
        }

        const response = await axios.request({
          baseURL,
          url,
          method,
          data,
          headers,
        });

        dispatch(apiCallSuccess(response.data));

        if (onSuccessAlert) dispatch(onSuccessAlert(response.data));

        if (onSuccess)
          dispatch({
            type: onSuccess,
            payload: response.data,
          });
      } catch (error) {
        console.error(error);

        if (
          error.response?.status === 401 ||
          (error.response?.status === 400 &&
            error.response?.data.startsWith("Invalid token"))
        ) {
          dispatch(userLogout());
        }

        dispatch(apiCallFailed(error.message));

        if (onFailedAlert) dispatch(onFailedAlert(error?.response?.data));

        if (onError)
          dispatch({
            type: onError,
            payload: error.message,
          });
      }
    }
  };

export default api;
