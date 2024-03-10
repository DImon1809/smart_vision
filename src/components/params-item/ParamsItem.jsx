import React, { useState, useCallback, useEffect } from "react";
import { useHTTP } from "../../hooks/useHTTP";

import "./ParamsItem.scss";

import arrowBase from "../../font/arrow-base.png";
import arrowHead from "../../font/arrow-head.png";
import close from "../../font/close.png";
import update from "../../font/update.png";

const ParamsItem = ({
  name,
  collectorUrl,
  threshold,
  depth,
  id,
  count,
  sleep,
  deleteParams,
  onClickUpdate,
  redirectToAnalysis,
  setOpenFloorWind,
  setFloorText,
}) => {
  const { request, ready } = useHTTP();

  const [preDelete, setPreDelete] = useState(false);
  const [paramStatus, setParamStatus] = useState("ERR");

  const getParamStatus = useCallback(async () => {
    const response = await request(
      "get",
      `http://212.22.94.121:8080/api/params/${id}/status`
    );

    console.log(response.data.paramStatus);

    if (response.data.paramStatus !== paramStatus) {
      response.data.paramStatus === "ERR" &&
        setFloorText(`У "${name}" превышен порог ошибок!`) &&
        setOpenFloorWind(true);

      setParamStatus(response.data.paramStatus);
    }
  }, [request]);

  const onDeleteHandler = async () => {
    try {
      setPreDelete(true);

      await sleep(500);

      return await deleteParams(id);
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
    }, 10000);
  }, [id]);

  return (
    <div className={preDelete ? "param-item pre-delete" : "param-item"}>
      <div className="icons-wrapper">
        <img
          src={update}
          alt="#"
          className="update"
          onClick={() => onClickUpdate(id)}
        />
        <img src={close} alt="#" className="close" onClick={onDeleteHandler} />
      </div>
      <div className="param-infomation-wrapper">
        <div className="param-text-wrapper">
          <div className="param-title-wrapper">
            <p className="param-number">{count}.</p>
            <p className="param-title">{name}</p>
          </div>
          <div className="param-value-wrapper">
            <p className="param-value">{collectorUrl}</p>
          </div>
        </div>

        <div
          className={
            paramStatus === "ERR"
              ? "circle-param-item err"
              : paramStatus === "warn"
              ? "circle-param-item warn"
              : "circle-param-item"
          }
        >
          {paramStatus === "ERR"
            ? "ERR"
            : paramStatus === "warn"
            ? "WARN"
            : "OK"}
        </div>
      </div>
      <div
        className={
          paramStatus === "ERR"
            ? "param-item-button err"
            : paramStatus === "warn"
            ? "param-item-button warn"
            : "param-item-button"
        }
        onClick={() => redirectToAnalysis(id)}
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
