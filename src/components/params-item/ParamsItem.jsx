import React, { useState } from "react";

import "./ParamsItem.scss";

import arrowBase from "../../font/arrow-base.png";
import arrowHead from "../../font/arrow-head.png";
import close from "../../font/close.png";

const ParamsItem = ({
  name,
  collectorUrl,
  threshold,
  depth,
  id,
  count,
  deleteParams,
  redirectToAnalysis,
}) => {
  return (
    <div className="param-item">
      <img
        src={close}
        alt="#"
        className="close"
        onClick={() => deleteParams(id)}
      />
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
            depth > threshold ? "circle-param-item err" : "circle-param-item"
          }
        >
          {depth > threshold ? "ERR" : "OK"}
        </div>
      </div>
      <div
        className={
          depth > threshold ? "param-item-button err" : "param-item-button"
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
