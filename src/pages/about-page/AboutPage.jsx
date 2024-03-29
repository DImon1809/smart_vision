import React, { useState, useEffect, useRef } from "react";

import "./AboutPage.scss";

const AboutPage = () => {
  const [loading, setLoading] = useState(false);

  const anchorRef = useRef();

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    anchorRef.current.scrollIntoView();
  }, []);

  return (
    <section className="about-section">
      <div ref={anchorRef} style={{ position: "absolute", top: 0 }}></div>
      <div className={loading ? "about-wrapper load" : "about-wrapper"}>
        <div className="about-title">
          <h2>Как работает Smart Vision?</h2>
        </div>
        <div className="about-paragrh">
          <p>
            Система состоит из сборщика актуальных параметров, модуля анализа и
            пользовательского интерфейса. Состояние с анализируемых узлов
            собирается с помощью специализированной программы. Параметры с
            определенной периодичностью отправляются по сети в общее хранилище.
            Модуль анализа выявляет возможные сбои с помощью заранее
            определенных правил. Результаты анализа сохраняются в базу данных и
            просматриваются с помощью веб интерфейса. Данное приложение
            позволяет автоматизировать довольно рутинную работу по поиску ошибок
            и имеет все шансы стать незаменимым помощником для вашей компании.
          </p>
        </div>

        <div className="about-visual-wrapper">
          <div className="about-visual">
            <div className="first-elem">
              <span className="visual-title-item">Аналитик</span>
              <span className="visual-arrow-first"></span>
              <span className="visual-arrow-fourth"></span>
            </div>
            <div className="second-elem">
              <span className="visual-title-item">Графики результата</span>
              <span className="visual-arrow-second"></span>
              <span className="visual-title-item">Создание параметра</span>
              <span className="visual-arrow-third"></span>
            </div>
            <div className="third-elem">
              <span className="visual-title-item">Сервер</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
