import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentParams } from "../../features/paramsSlice";

import ParamsItem from "../params-item/ParamsItem";
import Button from "../UI/Button";
import FloorWindow from "../floor-window/FloorWindow";

import "./MainPage.scss";

import arrowBase from "../../font/arrow-base.png";
import arrowHead from "../../font/arrow-head.png";
import pencil from "../../font/pencil.png";

const MainPage = () => {
  const navigate = useNavigate();
  const { idTestParams, currentParams } = useSelector(
    (state) => state.paramsData
  );
  const dispatch = useDispatch();
  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");
  const [testData, setTestData] = useState(false);

  const redirectToAnalysis = (id) => navigate(`/${id}`);

  const getFromAndToDate = () => {
    const today = new Date().getTime();

    const from = new Date(today - 86400000).toISOString();
    const to = new Date(today + 86400000).toISOString();

    return { from, to };
  };

  const requestData = useCallback(async () => {
    try {
      const { from, to } = getFromAndToDate();
      console.log(idTestParams);
      console.log(from + " " + to);

      const response = await axios({
        method: "get",
        url: `http://212.22.94.121:8080/api/params/${idTestParams}/values`,
        data: {},
        headers: {
          "Content-Type": "application/json",
          paramId: idTestParams,
          from,
          to,
        },
      });

      console.log(response);

      setTestData(true);
    } catch (err) {
      setFloorText("Ошибка!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  useEffect(() => {
    requestData();
  }, [requestData]);

  const createTestParam = async () => {
    try {
      // if (idTestParams in currentParams) {
      //   setFloorText("Тестовый параметр уже есть!");
      //   return setOpenFloorWind(true);
      // }

      if (testData) {
        return setOpenFloorWind(true);
      }

      let now = new Date().toISOString();

      const response = await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params/${idTestParams}/values`,
        data: {
          instant: now,
          value: 10,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      dispatch(setCurrentParams([idTestParams, now]));
      setFloorText("Параметр создан!");

      setOpenFloorWind(true);

      return await requestData();
    } catch (err) {
      setFloorText("Ошибка!");
      setOpenFloorWind(true);

      console.error(err);
    }
  };

  return (
    <section className="main-section">
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
        <div className="param-item-button test-param" onClick={createTestParam}>
          <p>Создать тестовый параметр</p>
          <div className="arrow">
            <img src={arrowBase} alt="#" className="arrow-base" />
            <img src={arrowHead} alt="#" className="arrow-head" />
          </div>
        </div>
      </div>

      <div className="params-lists">
        <h3>Список параметров</h3>

        <ParamsItem>
          <div
            className="param-item-button"
            onClick={() => redirectToAnalysis(1)}
          >
            <p>Анализировать</p>
            <div className="arrow">
              <img src={arrowBase} alt="#" className="arrow-base" />
              <img src={arrowHead} alt="#" className="arrow-head" />
            </div>
          </div>
        </ParamsItem>
      </div>
    </section>
  );
};

export default MainPage;
