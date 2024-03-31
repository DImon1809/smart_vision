import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHTTP } from "../../hooks/useHTTP";

import ParamsItem from "../../components/params-item/ParamsItem";
import BigButton from "../../components/UI/big-button/BigButton";
import FloorWindow from "../../components/floor-window/FloorWindow";
import Loading from "../../components/loading/Loading";
import Wrapper from "../../components/UI/page-wrapper/Wrapper";
import EmptyBlock from "../../components/UI/empty-block/EmptyBlock.jsx";

import DoughnutGraph from "../../components/UI/graphs/doughnut/DoughnutGraph.jsx";

import "./MainPage.scss";

import pencil from "../../font/pencil.png";
import asterisc from "../../font/asterisc.png";
import exclamation from "../../font/exclamation.png";

const validParamsKey = "validParams";

const MainPage = () => {
  const navigate = useNavigate();
  const { request, ready } = useHTTP();

  const patternRef = useRef();

  const [updateParam, setUpdateParam] = useState({
    id: "",
    name: "",
    threshold: "",
    depth: "",
    collectorUrl: "",
  });

  const [updateButton, setUpdateButton] = useState(false);

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");

  const [clue, setClue] = useState(false);
  const [clueUnactive, setClueUnactive] = useState(false);

  const [loadingPage, setLoadingPage] = useState(false);
  const [alertInput, setAlertInput] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [validParams, setValidParams] = useState([]);

  const anchorRef = useRef();

  // console.log(validParams);

  const httpReg =
    /(^http?:\/\/)([0-9]+).([0-9]+).([0-9]+).([0-9]+):([0-9]+).$/gi;
  const httpsReg =
    /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/gi;

  const sleep = async (time) =>
    new Promise((resolve) => setTimeout(() => resolve(true), time));

  const redirectToAnalysis = (id, paramStatus) => {
    if (paramStatus !== "PEN") return navigate(`/param/${id}`);

    setFloorText("Статус пока не установлен!");

    return setOpenFloorWind(true);
  };

  const genRandomId = () => Math.ceil(Math.random() * 100);

  const setValuesInputs = (_param) => setUpdateParam(_param);

  const openCloseWrapperAndFloorWind = () => setOpenFloorWind(false);

  const requestByStopCreateData = async (id) => {
    try {
      await request(
        "get",
        `http://212.22.94.121:8080/api/params/${id}/values/stop-test-generation`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const requestData = useCallback(async () => {
    try {
      setUpdateParam({
        id: "",
        name: "",
        threshold: "",
        depth: "",
        collectorUrl: "",
      });

      patternRef.current.value = "400";

      const response = await request(
        "get",
        `http://212.22.94.121:8080/api/params`
      );

      const params = response.data.map((_l) => _l.id);
      const paramsStatusValue = {};

      for (let item of params) {
        paramsStatusValue[item] = false;
      }

      localStorage.setItem(validParamsKey, JSON.stringify(paramsStatusValue));

      setValidParams(response.data);

      setUpdateButton(false);

      return response.data;
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  const onClickUpdate = (id) => {
    const _param = validParams.find((param) => param.id === id);

    setValuesInputs(_param);

    patternRef.current.value = _param.pattern;

    return setUpdateButton(true);
  };

  const cancelUpdateParamReq = () => {
    setUpdateParam({
      id: "",
      name: "",
      threshold: "",
      depth: "",
      collectorUrl: "",
    });

    patternRef.current.value = "400";

    setUpdateButton(false);
  };

  const updateParamReq = async () => {
    try {
      if (
        !updateParam.name ||
        !updateParam.threshold ||
        !updateParam.collectorUrl ||
        !updateParam.depth
      ) {
        setFloorText("Введите данные!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        !httpReg.test(updateParam.collectorUrl) &&
        !httpsReg.test(updateParam.collectorUrl)
      ) {
        setFloorText("Url должен состоять только из домена!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (updateParam.name.length > 10) {
        setFloorText("Название не должно превышать 10 символов!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        !(Number(updateParam.threshold) - 0) ||
        !(Number(updateParam.depth) - 0)
      ) {
        setFloorText("Порог и глубина должны быть числами!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        validParams.find((_l) => _l.name === updateParam.name) &&
        validParams.find((_l) => _l.pattern === patternRef.current.value) &&
        !validParams.find((_l) => _l.id === updateParam.id)
      ) {
        setFloorText("Метрика с таким именем и типом ошибок уже существует!");

        return setOpenFloorWind(true);
      }

      await request("put", `http://212.22.94.121:8080/api/params`, {
        ...updateParam,
        pattern: patternRef.current.value,
      });

      setValuesInputs();

      setFloorText("Метрика успешно обновлена!");

      setOpenFloorWind(true);

      return await requestData();
    } catch (err) {
      setFloorText("Что-то пошло не так!");

      setOpenFloorWind(true);

      console.error(err);
    }
  };

  const createParam = async () => {
    try {
      let _id = genRandomId();

      if (validParams.length >= 5) {
        setFloorText("Нельзя создавать больше пяти метрик!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        !httpReg.test(updateParam.collectorUrl) &&
        !httpsReg.test(updateParam.collectorUrl)
      ) {
        setFloorText("Url должен состоять только из домена!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        !updateParam.name ||
        !updateParam.threshold ||
        !updateParam.collectorUrl ||
        !updateParam.depth
      ) {
        setFloorText("Введите данные!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (updateParam.name.length > 10) {
        setFloorText("Название не должно превышать 10 символов!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        !(Number(updateParam.threshold) - 0) ||
        !(Number(updateParam.depth) - 0)
      ) {
        setFloorText("Порог и глубина должны быть числами!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (
        validParams.find((_l) => _l.name === updateParam.name) &&
        validParams.find((_l) => _l.pattern === patternRef.current.value)
      ) {
        setFloorText("Метрика с таким именем и типом ошибок уже существует!");

        return setOpenFloorWind(true);
      }

      if (validParams.some((param) => param.id === _id))
        return await createParam();

      const responseCreate = await request(
        "post",
        `http://212.22.94.121:8080/api/params`,
        {
          id: _id,
          name: updateParam.name,
          threshold: updateParam.threshold,
          depth: updateParam.depth,
          pattern: patternRef.current.value,
          collectorUrl: updateParam.collectorUrl,
        }
      );

      // await request(
      //   "post",
      //   `http://212.22.94.121:8080/api/params/${responseCreate.data.id}/values`,
      //   {
      //     instant: new Date().toISOString(),
      //     value: responseCreate.data.depth,
      //   }
      // );

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

      if (validParams.length >= 5) {
        setFloorText("Нельзя создавать больше пяти метрик!");

        setAlertInput(true);

        return setOpenFloorWind(true);
      }

      if (_checkReq.length) {
        setFloorText("Тестовая метрика уже создана!");

        return setOpenFloorWind(true);
      }

      const responseCreate = await request(
        "post",
        `http://212.22.94.121:8080/api/params`,
        {
          id: 1,
          name: "Ошибки",
          threshold: 20,
          depth: 60,
          pattern: "404",
          collectorUrl: "localhost",
        }
      );

      // await request(
      //   "post",
      //   `http://212.22.94.121:8080/api/params/${responseCreate.data.id}/values`,
      //   {
      //     instant: new Date().toISOString(),
      //     value: responseCreate.data.depth,
      //   }
      // );

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

      return await request(
        "delete",
        `http://212.22.94.121:8080/api/params/${id}`
      );
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
    setAlertInput(false);
  }, [updateParam]);

  useEffect(() => {
    if (clue) {
      setTimeout(() => {
        setClueUnactive(true);
      }, 2000);

      setTimeout(() => {
        setClue(false);
        setClueUnactive(false);
      }, 3000);
    }
  }, [clue]);

  useEffect(() => {
    setLoadingPage(true);

    // localStorage.removeItem(graphKeyX);
    // localStorage.removeItem(graphKeyY);
    // localStorage.removeItem(graphKeyMin);
    // localStorage.removeItem(graphKeyMax);
  }, []);

  useEffect(() => {
    anchorRef.current.scrollIntoView();
  }, []);

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
      {/* {clue && <Clue />} */}
      <div ref={anchorRef} style={{ position: "absolute", top: 0 }}></div>
      <div className={loadingPage ? "fuctional-card load" : "fuctional-card"}>
        <div id="anchor"></div>
        <div className="create-params">
          <div className="create-params-text">
            <h3>Создать метрику</h3>
          </div>
          <div className="params-inputs-wrapper">
            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              {alertInput && !updateParam.name && (
                <img src={asterisc} alt="#" className="asterisc" />
              )}
              <input
                type="text"
                placeholder="Введите название..."
                className={
                  alertInput && !updateParam.name ? "input alert" : "input"
                }
                value={updateParam.name}
                onChange={(event) =>
                  setUpdateParam({ ...updateParam, name: event.target.value })
                }
              />
            </div>

            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              {alertInput && !updateParam.collectorUrl && (
                <img src={asterisc} alt="#" className="asterisc" />
              )}
              <input
                type="text"
                placeholder="Введите url..."
                className={
                  alertInput && !updateParam.collectorUrl
                    ? "input alert"
                    : "input"
                }
                value={updateParam.collectorUrl}
                onChange={(event) =>
                  setUpdateParam({
                    ...updateParam,
                    collectorUrl: event.target.value.toLowerCase(),
                  })
                }
              />
            </div>

            <div className={alertInput ? "params-input alert" : "params-input"}>
              <img src={pencil} alt="#" className="pencil" />
              {alertInput && !updateParam.threshold && (
                <img src={asterisc} alt="#" className="asterisc" />
              )}

              <input
                type="text"
                placeholder="Допустимо ошибок..."
                className={
                  alertInput && !updateParam.threshold ? "input alert" : "input"
                }
                value={updateParam.threshold}
                onChange={(event) =>
                  setUpdateParam({
                    ...updateParam,
                    threshold: event.target.value,
                  })
                }
              />
            </div>

            <div className={alertInput ? "params-input alert" : "params-input"}>
              {clue && (
                <p className={clueUnactive ? "clue unactive" : "clue"}>
                  Максимум обрабатываемых ошибок за интервал времени
                </p>
              )}

              <img src={pencil} alt="#" className="pencil" />
              {alertInput && !updateParam.depth && (
                <img src={asterisc} alt="#" className="asterisc" />
              )}

              <img
                src={exclamation}
                alt="#"
                className="exclamation"
                onClick={() => setClue(!clue)}
              />

              <input
                type="text"
                placeholder="Максимум ошибок..."
                className={
                  alertInput && !updateParam.depth ? "input alert" : "input"
                }
                value={updateParam.depth}
                onChange={(event) =>
                  setUpdateParam({
                    ...updateParam,
                    depth: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="params-select">
            <p>Выбрать тип ошибок</p>
            <select name="select-pattern" id="select-pattern" ref={patternRef}>
              <option value="400">400</option>
              <option value="401">401</option>
              <option value="403">403</option>
              <option value="404">404</option>
              <option value="405">405</option>
              <option value="406">406</option>
              <option value="407">407</option>
              <option value="408">408</option>
              <option value="409">409</option>
              <option value="500">500</option>
              <option value="501">501</option>
              <option value="502">502</option>
              <option value="503">503</option>
              <option value="504">504</option>
              <option value="505">505</option>
            </select>
          </div>

          {updateButton ? (
            <BigButton onClickHandler={updateParamReq}>Обновить</BigButton>
          ) : (
            <BigButton onClickHandler={createParam}>Создать</BigButton>
          )}
        </div>

        <div className="create-test-params">
          {updateButton ? (
            <BigButton onClickHandler={cancelUpdateParamReq}>
              Отменить
            </BigButton>
          ) : (
            <BigButton onClickHandler={createTestParam}>
              Создать тестовую метрику
            </BigButton>
          )}
        </div>
      </div>

      <DoughnutGraph validParams={validParams} />

      <div className="params-lists">
        <h3>Список метрик</h3>
        {loading ? (
          <Loading />
        ) : validParams.length ? (
          validParams.map((item, index) => (
            <ParamsItem
              name={item.name}
              collectorUrl={item.collectorUrl}
              pattern={item.pattern}
              threshold={item.threshold}
              depth={item.depth}
              id={item.id}
              key={index}
              count={index + 1}
              sleep={sleep}
              deleteParams={deleteParams}
              onClickUpdate={onClickUpdate}
              redirectToAnalysis={redirectToAnalysis}
            ></ParamsItem>
          ))
        ) : (
          <EmptyBlock>Пока ничего нет</EmptyBlock>
        )}
      </div>
    </section>
  );
};

export default MainPage;
