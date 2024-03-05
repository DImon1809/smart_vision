import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHTTP } from "../../hooks/useHTTP";
import { useAuth } from "../../hooks/useAuth";

import "./FormPage.scss";

import eye from "../../font/eye.png";
import key from "../../font/key.png";
import log from "../../font/login.png";
import eyeClose from "../../font/eye-close.png";

const FormPage = () => {
  const [yesEye, setyesEye] = useState(false);
  const { request } = useHTTP();
  const { logIn } = useAuth();
  const passRef = useRef();
  const navigate = useNavigate();

  const changePassTypeHandler = () => {
    if (yesEye) {
      setyesEye(!yesEye);
      return (passRef.current.type = "text");
    }

    setyesEye(!yesEye);
    return (passRef.current.type = "password");
  };

  const logInButtonHandler = async (event) => {
    try {
      event.preventDefault();

      const data = await request();

      if (data) {
        logIn(data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="form-section">
      <div className="animation-form">
        <div className="form-wrapper">
          <form className="form">
            <div className="form-title">
              <h2>Добро пожаловать в Smart Vision</h2>
            </div>
            <div className="input-data">
              <img src={log} alt="#" className="log" />
              <input
                type="text"
                name="email"
                id="email"
                placeholder=" "
                autoComplete="off"
              />
              <label htmlFor="email">Введите е-mail</label>
            </div>
            <div className="input-data">
              <img src={key} alt="#" className="key" />
              <input
                type="password"
                name="password"
                id="password"
                placeholder=" "
                autoComplete="off"
                ref={passRef}
              />
              <label htmlFor="password">Введите пароль</label>
              {yesEye ? (
                <img
                  src={eye}
                  alt="#"
                  className="eye"
                  onClick={changePassTypeHandler}
                />
              ) : (
                <img
                  src={eyeClose}
                  alt="#"
                  className="eye-close"
                  onClick={changePassTypeHandler}
                />
              )}
            </div>
            <div className="form-buttons">
              <button className="login" onClick={logInButtonHandler}>
                Войти
              </button>
              <button
                className="sign-up"
                onClick={(event) => event.preventDefault()}
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormPage;
