import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Preview.scss";

const Preview = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const startButtonHandler = () => {
    setRedirect(true);

    setTimeout(() => {
      navigate("/form");
    }, 300);
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <section className="preview-wrapper">
      <div className={redirect ? "preview-title redirect" : "preview-title "}>
        <h1 className={loading ? "preview load" : "preview"}>Smart Vision</h1>
        <h2 className={loading ? "preview load" : "preview"}>
          Система мониторинга с интеллектуальным анализом состояния системы
        </h2>
        <button
          className={loading ? "start-button load" : "start-button"}
          onClick={startButtonHandler}
        >
          Начать тестировать
        </button>
      </div>
    </section>
  );
};

export default Preview;
