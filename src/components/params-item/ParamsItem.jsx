import React, { useState, useCallback, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { useHTTP } from "../../hooks/useHTTP";

import FloorWindow from "../../components/floor-window/FloorWindow";

import "./ParamsItem.scss";

import arrowBase from "../../font/arrow-base.png";
import arrowHead from "../../font/arrow-head.png";
import close from "../../font/close.png";
import update from "../../font/update.png";

const ParamsItem = ({
  name,
  collectorUrl,
  pattern,
  id,
  count,
  deleteParams,
  onClickUpdate,
  redirectToAnalysis,
}) => {
  const { request, ready } = useHTTP();

  const [preDelete, setPreDelete] = useState(false);
  const [paramStatus, setParamStatus] = useState("PEN");

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");
  const [floorButton, setFloorButton] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const getParamStatus = useCallback(async () => {
    const response = await request(
      "get",
      `http://212.22.94.121:8080/api/params/${id}/status`
    );

    setParamStatus(response.data.status);
  }, [request]);

  const confirmDeleteHandler = (bool) => setConfirmDelete(bool);

  const onDeleteHandler = () => {
    try {
      setFloorText("Подтвердите удаление");

      setFloorButton(true);

      setOpenFloorWind(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        await getParamStatus();
      } catch (err) {
        setFloorText("Параметр успешно создан!");

        setOpenFloorWind(true);

        clearInterval(interval);

        console.error(err);
      }
    }, 5000);
  }, [id]);

  useEffect(() => {
    if (confirmDelete) {
      setPreDelete(true);

      setTimeout(() => {
        deleteParams(id);
      }, 500);
    }
  }, [confirmDelete]);

  useEffect(() => {
    if (!paramStatus) {
      setFloorText(`У "${name}" превышен порог ошибок!`);
      setOpenFloorWind(true);
    }
  }, [paramStatus]);

  return (
    <div className={preDelete ? "param-item pre-delete" : "param-item"}>
      {openFloorWind && (
        <FloorWindow
          setOpenFloorWind={setOpenFloorWind}
          floorText={floorText}
          floorButton={floorButton}
          confirmDeleteHandler={confirmDeleteHandler}
        />
      )}
      <div className="icons-wrapper">
        <HashLink to="#anchor">
          <img
            src={update}
            alt="#"
            className="update"
            onClick={() => onClickUpdate(id)}
          />
        </HashLink>
        <img src={close} alt="#" className="close" onClick={onDeleteHandler} />
      </div>
      <div className="param-infomation-wrapper">
        <div className="param-text-wrapper">
          <div className="param-title-wrapper">
            <p className="param-number">{count}.</p>
            <p className="param-title">
              {name}{" "}
              {collectorUrl === "localhost"
                ? " с типом: " + 404
                : " с типом: " + pattern}
            </p>
          </div>
          <div className="param-value-wrapper">
            <p className="param-value">{collectorUrl}</p>
          </div>
        </div>

        <div
          className={
            paramStatus
              ? paramStatus === "PEN"
                ? "circle-param-item"
                : "circle-param-item ok"
              : "circle-param-item err"
          }
        >
          {paramStatus ? (paramStatus === "PEN" ? "PEN" : "OK") : "ERR"}
        </div>
      </div>

      <div
        className={
          paramStatus
            ? paramStatus === "PEN"
              ? "param-item-button"
              : "param-item-button ok"
            : "param-item-button err"
        }
        onClick={() => redirectToAnalysis(id, paramStatus)}
      >
        <p>Анализировать</p>
        <div className="arrow">
          <img src={arrowBase} alt="#" className="arrow-base" />
          <img src={arrowHead} alt="#" className="arrow-head" />
        </div>
      </div>
    </div>
  );
};

export default ParamsItem;
