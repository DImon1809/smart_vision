import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import Wrapper from "../UI/page-wrapper/Wrapper";

import "./Navbar.scss";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const logOutHandler = () => {
    logOut();

    navigate("/form");
  };

  const clickBurgerHandler = () => setActive(!active);

  return (
    <nav className="nav">
      <div className="logo-wrapper">
        <h2 className="logo">Smart Vision</h2>
      </div>
      <div
        className={active ? "nav-items-wrapper active" : "nav-items-wrapper"}
      >
        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/about">О приложении</Link>
          </li>
          <li className="nav-item">
            <Link to="/">Параметры</Link>
          </li>
          <li className="nav-item" onClick={logOutHandler}>
            Выйти
          </li>
        </ul>
      </div>
      <div
        className={active ? "burger active" : "burger"}
        onClick={clickBurgerHandler}
      >
        <span></span>
      </div>
      <Wrapper
        wapperActive={active}
        onWrapperClickHandler={clickBurgerHandler}
      />
    </nav>
  );
};

export default Navbar;
