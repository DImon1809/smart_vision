import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ParamsItem from "../params-item/ParamsItem";
import Button from "../UI/Button";
import FloorWindow from "../floor-window/FloorWindow";

import "./MainPage.scss";

import arrowBase from "../../font/arrow-base.png";
import arrowHead from "../../font/arrow-head.png";
import pencil from "../../font/pencil.png";

const MainPage = () => {
  const navigate = useNavigate();

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [floorText, setFloorText] = useState("Внимание");
  // const [params, setParams] = useState([
  //   { id: 101, name: "Тестовый парметр", collectorUrl: "Тест" },
  //   { id: 102, name: "Тестовый парметр", collectorUrl: "Тест" },
  //   { id: 103, name: "Тестовый парметр", collectorUrl: "Тест" },
  // ]);
  const [validParams, setValidParams] = useState([]);

  const sleep = async (time) =>
    new Promise((resolve) => setTimeout(() => resolve(true), time));

  const redirectToAnalysis = (id) => {
    navigate(`/${id}`);
  };

  const requestData = useCallback(async () => {
    try {
      const response = await axios({
        method: "get",
        url: `http://212.22.94.121:8080/api/params`,
        data: {},
        headers: {
          "Content-Type": "application/json",
        },
      });

      setValidParams(response.data);

      return response.data;
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  useEffect(() => {
    requestData();
  }, [requestData]);

  useEffect(() => {
    if (validParams.length) return setFullScreen(false);

    return setFullScreen(true);
  }, [validParams]);

  const createTestParam = async () => {
    try {
      const _checkReq = await requestData();

      if (_checkReq.length) {
        setFloorText("Параметр уже создан!");

        return setOpenFloorWind(true);
      }

      const response = await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params`,
        data: {
          id: 1,
          name: "Ошибки 404",
          threshold: 20,
          depth: 60,
          pattern: "404",
          collectorUrl: "localhost",
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFloorText("Параметр создан!");

      setOpenFloorWind(true);

      await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params/${response.data.id}/values`,
        data: {
          instant: new Date().toISOString(),
          value: Math.max(response.data.depth, response.data.threshold),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      await sleep(2000);

      setFloorText("Превышен допустимый порог ошибок!");

      setOpenFloorWind(true);

      return await requestData();
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  };

  const deleteParams = async (id) => {
    try {
      setValidParams(validParams.filter((_l) => _l.id !== id));

      await axios({
        method: "delete",
        url: `http://212.22.94.121:8080/api/params/${id}`,
        data: {},
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFloorText("Параметр успешно удалён!");

      setOpenFloorWind(true);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  };

  return (
    <section
      className={fullScreen ? "main-section full-screen" : "main-section"}
    >
      <div className="create-params">
        <div className="create-params-text">
          <h3>Создать параметр</h3>
        </div>
        <div className="params-inputs-wrapper">
          <div className="params-input">
            <img src={pencil} alt="#" className="pencil" />
            <input type="text" placeholder="Введите значение..." />
          </div>

          <div className="params-input">
            <img src={pencil} alt="#" className="pencil" />
            <input type="text" placeholder="Введите название..." />
          </div>

          <Button>Создать</Button>
        </div>
      </div>

      {openFloorWind && (
        <FloorWindow
          setOpenFloorWind={setOpenFloorWind}
          floorText={floorText}
        />
      )}

      <div className="create-test-params">
        <div className="param-test-button" onClick={createTestParam}>
          <p>Создать тестовый параметр</p>
          <div className="arrow">
            <img src={arrowBase} alt="#" className="arrow-base" />
            <img src={arrowHead} alt="#" className="arrow-head" />
          </div>
        </div>
      </div>

      <div className="params-lists">
        <h3>Список параметров</h3>

        {validParams.length ? (
          validParams.map((_l, index) => (
            <ParamsItem
              deleteParams={deleteParams}
              name={_l.name}
              collectorUrl={_l.collectorUrl}
              threshold={_l.threshold}
              depth={_l.depth}
              id={_l.id}
              key={index}
              count={index + 1}
              redirectToAnalysis={redirectToAnalysis}
            ></ParamsItem>
          ))
        ) : (
          <div className="param-alert">
            <h3>Пока ничего нет</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainPage;
