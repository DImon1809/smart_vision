import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useHTTP } from "../../hooks/useHTTP";

import ParamsItem from "../../components/params-item/ParamsItem";
import BigButton from "../../components/UI/big-button/BigButton";
import FloorWindow from "../../components/floor-window/FloorWindow";
import Loading from "../../components/loading/Loading";
import Wrapper from "../../components/UI/page-wrapper/Wrapper";

import "./MainPage.scss";

import pencil from "../../font/pencil.png";

const MainPage = () => {
  const navigate = useNavigate();
  const { request, ready } = useHTTP();

  const [name, setName] = useState("");
  const [collectorUrl, setCollectorUrl] = useState("");
  const [threshold, setThreshold] = useState("");

  const [update, setUpdate] = useState(false);

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");

  const [loadingPage, setLoadingPage] = useState(false);
  const [alertInput, setAlertInput] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [loading, setLoading] = useState(true);
  // const [params, setParams] = useState([
  //   { id: 101, name: "Тестовый парметр", collectorUrl: "Тест" },
  //   { id: 102, name: "Тестовый парметр", collectorUrl: "Тест" },
  //   { id: 103, name: "Тестовый парметр", collectorUrl: "Тест" },
  // ]);
  const [validParams, setValidParams] = useState([]);

  const sleep = async (time) =>
    new Promise((resolve) => setTimeout(() => resolve(true), time));

  const redirectToAnalysis = (id) => {
    navigate(`/param/${id}`);
  };

  const genRandomId = () => Math.ceil(Math.random() * 100);

  const setValuesInputs = (
    valueName = "",
    valueCollectorUrl = "",
    valueThreshold = ""
  ) => {
    setName(valueName);
    setCollectorUrl(valueCollectorUrl);
    setThreshold(valueThreshold);
  };

  const openCloseWrapperAndFloorWind = () => setOpenFloorWind(false);

  const requestData = useCallback(async () => {
    try {
      const response = await request(
        "get",
        `http://212.22.94.121:8080/api/params`
      );

      setValidParams(response.data);

      return response.data;
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  const onClickUpdate = (id) => {
    const _param = validParams.find((param) => param.id === id);

    setValuesInputs(_param.name, _param.collectorUrl, _param.threshold);

    return setUpdate(true);
  };

  const createParam = async () => {
    try {
      let _id = genRandomId();

      if (!name || !threshold || !collectorUrl) {
        setFloorText("Введите данные!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (!(Number(threshold) - 0)) {
        setFloorText("Порог должен быть числом!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (validParams.some((param) => param.id === _id))
        return await createParam();

      await request("post", `http://212.22.94.121:8080/api/params`, {
        id: _id,
        name,
        threshold,
        depth: 60,
        pattern: "404",
        collectorUrl,
      });

      setValuesInputs();

      setFloorText("Параметр успешно создан!");

      setOpenFloorWind(true);

      return await requestData();
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  };

  const createTestParam = async () => {
    try {
      const _checkReq = await requestData();

      if (_checkReq.length) {
        setFloorText("Параметр уже создан!");

        return setOpenFloorWind(true);
      }

      const responseCreate = await request(
        "post",
        `http://212.22.94.121:8080/api/params`,
        {
          id: 1,
          name: "Ошибки 404",
          threshold: 20,
          depth: 60,
          pattern: "404",
          collectorUrl: "localhost",
        }
      );

      await request(
        "post",
        `http://212.22.94.121:8080/api/params/${responseCreate.data.id}/values`,
        {
          instant: new Date().toISOString(),
          value: responseCreate.data.depth,
        }
      );

      setFloorText("Параметр создан!");

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

      await request(
        "delete",
        `http://212.22.94.121:8080/api/params/${id}/values`
      );

      await request("delete", `http://212.22.94.121:8080/api/params/${id}`);

      setFloorText("Параметр успешно удалён!");

      setOpenFloorWind(true);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  };

  useEffect(() => {
    requestData();
  }, [requestData]);

  useEffect(() => {
    if (validParams.length) return setFullScreen(false);

    return setFullScreen(true);
  }, [validParams]);

  useEffect(() => {
    if (ready) return setLoading(false);

    return setLoading(true);
  }, [ready]);

  useEffect(() => {
    setLoadingPage(true);
  }, []);

  useEffect(() => {
    setAlertInput(false);
  }, [name, threshold, collectorUrl]);

  return (
    <section
      className={fullScreen ? "main-section full-screen" : "main-section"}
    >
      <Wrapper
        wapperActive={openFloorWind}
        onWrapperClickHandler={openCloseWrapperAndFloorWind}
      />
      {openFloorWind && (
        <FloorWindow
          setOpenFloorWind={setOpenFloorWind}
          floorText={floorText}
        />
      )}
      <div className={loadingPage ? "fuctional-card load" : "fuctional-card"}>
        <div className="create-params">
          <div className="create-params-text">
            <h3>Создать параметр</h3>
          </div>
          <div className="params-inputs-wrapper">
            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              <input
                type="text"
                placeholder="Введите название..."
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              <input
                type="text"
                placeholder="Введите url..."
                value={collectorUrl}
                onChange={(event) => setCollectorUrl(event.target.value)}
              />
            </div>

            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              <input
                type="text"
                placeholder="Максимум ошибок..."
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
              />
            </div>

            {update ? (
              <BigButton>Обновить</BigButton>
            ) : (
              <BigButton onClickHandler={createParam}>Создать</BigButton>
            )}
          </div>
        </div>

        <div className="create-test-params">
          <BigButton onClickHandler={createTestParam}>
            Создать тестовый параметр
          </BigButton>
        </div>
      </div>

      <div className="params-lists">
        <h3>Список параметров</h3>
        {loading ? (
          <Loading />
        ) : validParams.length ? (
          validParams.map((item, index) => (
            <ParamsItem
              name={item.name}
              collectorUrl={item.collectorUrl}
              threshold={item.threshold}
              depth={item.depth}
              id={item.id}
              key={index}
              count={index + 1}
              sleep={sleep}
              deleteParams={deleteParams}
              onClickUpdate={onClickUpdate}
              redirectToAnalysis={redirectToAnalysis}
              setOpenFloorWind={setOpenFloorWind}
              setFloorText={setFloorText}
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
