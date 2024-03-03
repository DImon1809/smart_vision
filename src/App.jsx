import React, { useEffect } from "react";
import { router } from "./router";
import { useSelector } from "react-redux";
import { useAuth } from "./hooks/useAuth";

import Navbar from "./components/navbar/Navbar";

import "./App.scss";

const App = () => {
  const { checkToken } = useAuth();
  const token = useSelector((state) => state.userData.token);
  const isAuthorized = !!token;

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <>
      {isAuthorized && <Navbar />}
      {router(isAuthorized)}
    </>
  );
};

export default App;
