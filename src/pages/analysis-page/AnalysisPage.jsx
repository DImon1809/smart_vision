import React, { useEffect, useCallback, useState, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";

import { useHTTP } from "../../hooks/useHTTP";
import { useGetDate } from "../../hooks/useGetDate.js";

import SmallButton from "../../components/UI/small-button/SmallButton";
import FloorWindow from "../../components/floor-window/FloorWindow";
import Wrapper from "../../components/UI/page-wrapper/Wrapper";

import HistGraph from "../../components/UI/graphs/hist/HistGraph.jsx";
import RealTimeGraph from "../../components/UI/graphs/real-time/RealTimeGraph.jsx";

import "./AnalysisPage.scss";

const AnalysisPage = () => {
  let { id } = useParams();
  const { request } = useHTTP();
  const { getFromAndToDate } = useGetDate();

  const [titles, setTitles] = useState([]);

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");

  const [dateAndTimes, setDateAndTimes] = useState({
    minTime: "",
    maxTime: "",
    minDate: "",
    maxDate: "",
  });

  const [forHistRequest, setForHistRequest] = useState({
    id,
    instant: "",
    to: "",
  });

  const anchorRef = useRef();

  const openCloseWrapperAndFloorWind = () => setOpenFloorWind(false);

  const requestData = useCallback(async () => {
    try {
      const { from, to } = getFromAndToDate();

      const responseTitles = await request(
        "get",
        `http://212.22.94.121:8080/api/params`
      );

      const _titles = responseTitles.data.filter((_l) => _l.id === Number(id));

      setTitles([
        _titles[0].name,
        _titles[0].collectorUrl,
        _titles[0].pattern,
        _titles[0].threshold,
        _titles[0].depth,
      ]);

      setForHistRequest({ ...forHistRequest, instant: from, to });
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  const onClickSmallButton = () => {
    setForHistRequest({
      id,
      instant: new Date(
        `${dateAndTimes.minDate} ${dateAndTimes.minTime}`
      ).toISOString(),
      to: new Date(
        `${dateAndTimes.maxDate} ${dateAndTimes.maxTime}`
      ).toISOString(),
    });
  };

  useEffect(() => {
    requestData();
  }, [requestData]);

  useEffect(() => {
    anchorRef.current.scrollIntoView();
  }, []);

  return (
    <section className="analysis-section">
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
      <div ref={anchorRef} style={{ position: "absolute", top: 0 }}></div>
      <div className="analysis-infomation-wrapper">
        <div className="analysis-infomation">
          <h2 className="analysis-title">{titles[0]}</h2>
          <h2 className="analysis-value">{titles[1]}</h2>
        </div>
        <div className="analysis-date">
          <div className="analysis-date-before">
            <p>Период с</p>
            <input
              type="time"
              value={dateAndTimes.minTime}
              onChange={(event) =>
                setDateAndTimes({
                  ...dateAndTimes,
                  minTime: event.target.value,
                })
              }
            />
            <input
              type="date"
              value={dateAndTimes.minDate}
              onChange={(event) =>
                setDateAndTimes({
                  ...dateAndTimes,
                  minDate: event.target.value,
                })
              }
            />
          </div>
          <div className="analysis-date-after">
            <p>по</p>
            <input
              type="time"
              value={dateAndTimes.maxTime}
              onChange={(event) =>
                setDateAndTimes({
                  ...dateAndTimes,
                  maxTime: event.target.value,
                })
              }
            />
            <input
              type="date"
              value={dateAndTimes.maxDate}
              onChange={(event) =>
                setDateAndTimes({
                  ...dateAndTimes,
                  maxDate: event.target.value,
                })
              }
            />
          </div>
        </div>
        <HashLink to="#anchor" style={{ textDecoration: "none" }}>
          <SmallButton requestDataForGraphs={onClickSmallButton}>
            Применить
          </SmallButton>
        </HashLink>
      </div>
      <div className="analysis-result">
        <h2>Результаты</h2>

        <RealTimeGraph
          pattern={titles[2]}
          threshold={titles[3]}
          depth={titles.at(-1)}
          id={id}
        />

        <div id="anchor"></div>
        <HistGraph
          pattern={titles[2]}
          forHistRequest={forHistRequest}
          setDateAndTimes={setDateAndTimes}
          setOpenFloorWind={setOpenFloorWind}
          setFloorText={setFloorText}
        />
      </div>
    </section>
  );
};

export default AnalysisPage;
