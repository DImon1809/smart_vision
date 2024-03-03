import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../features/userSlice";

const tokenKey = "authToken";

export const useAuth = () => {
  const dispatch = useDispatch();

  const logIn = useCallback((data) => {
    dispatch(setToken(data));

    localStorage.setItem(tokenKey, data);
  }, []);

  const logOut = useCallback(() => {
    dispatch(setToken(null));

    localStorage.removeItem(tokenKey);
  }, []);

  const checkToken = useCallback(() => {
    const _token = localStorage.getItem(tokenKey);

    if (_token) {
      dispatch(setToken(_token));
      logIn(_token);
    }
  });

  return { logIn, logOut, checkToken };
};
