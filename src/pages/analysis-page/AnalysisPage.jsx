import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
import { useSortDate } from "../../hooks/useSortDate";
import { useHTTP } from "../../hooks/useHTTP";

import SmallButton from "../../components/UI/small-button/SmallButton";
import FloorWindow from "../../components/floor-window/FloorWindow";
import LoadingDoughnut from "../../components/loading-graph/LoadingDoughnut";
import LoadingHist from "../../components/loading-graph/LoadingHist";
import Wrapper from "../../components/UI/page-wrapper/Wrapper";

import "./AnalysisPage.scss";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AnalysisPage = () => {
  let { id } = useParams();
  const { request } = useHTTP();

  const { sortDate } = useSortDate();

  const [titles, setTitles] = useState([]);

  const [openFloorWind, setOpenFloorWind] = useState(false);
  const [floorText, setFloorText] = useState("Внимание");

  const [instantDate, setInstantDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [instantTime, setInstantTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [passedTests, setPassedTests] = useState(0);
  const [unPassedTests, setUnPassedTests] = useState(0);
  const [loadingDoughnut, setLoadingDoughnut] = useState(true);
  const [loadingHist, setLoadingHist] = useState(true);

  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [histLabel, setHistLabel] = useState([]);
  const [histData, setHistData] = useState([]);

  const doughnutGraphData = {
    labels: [],
    datasets: [
      {
        label: "Ошибки",
        data: [passedTests, unPassedTests],
        backgroundColor: ["yellow", "#E30000"],
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
  };

  const histGraphData = {
    labels: histLabel,
    datasets: [
      {
        label: "Ошибки",
        data: [
          ...histData,
          histData.reduce((acc, prev) => (acc > prev ? acc : prev), 0) * 2,
        ],
        backgroundColor: "#E30000",
        borderColor: "#E30000",
        borderWidth: 1,
      },
    ],
  };

  const openCloseWrapperAndFloorWind = () => setOpenFloorWind(false);

  const getFromAndToDate = () => {
    const today = new Date().getTime();

    const from = new Date(today - 2678400000).toISOString();
    const to = new Date(today).toISOString();

    return { from, to };
  };

  const requestDataForGraphs = async (_instant, _to) => {
    try {
      // const responseDoughnut = await axios({
      //   method: "post",
      //   url: `http://212.22.94.121:8080/api/params/graph/circle`,
      //   data: {
      //     paramIds: [id],
      //     startTime: new Date(_instant.join(" ")).toISOString(),
      //     endTime: new Date(_to.join(" ")).toISOString(),
      //   },
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      console.log(_instant);
      console.log(_to);

      const responseDoughnut = await request(
        "post",
        `http://212.22.94.121:8080/api/params/graph/circle`,
        {
          paramIds: [id],
          startTime: _instant,
          endTime: _to,
        }
      );

      setLoadingDoughnut(false);

      console.log(responseDoughnut);

      setUnPassedTests(responseDoughnut.data[id]);

      const responseHist = await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params/graph/hist`,
        data: {
          paramId: id,
          startTime: new Date(_instant.join(" ")),
          endTime: new Date(_to.join(" ")),
          bandAmount: 5,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoadingHist(false);

      const _errorsX = Object.keys(responseHist.data);

      const _errorsY = [];

      for (let item of _errorsX) {
        _errorsY.push(responseHist.data[item]);
      }

      setHistLabel(sortDate(_errorsX));

      setHistData(_errorsY);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);
      setLoadingHist(true);

      setLoadingDoughnut(true);

      console.error(err);
    }
  };

  const requestData = useCallback(async () => {
    try {
      const { from, to } = getFromAndToDate();

      const responseTitles = await request(
        "get",
        `http://212.22.94.121:8080/api/params`
      );

      const _titles = responseTitles.data.filter((_l) => _l.id === +id);

      setTitles([_titles[0].name, _titles[0].collectorUrl]);

      const responseData = await request(
        "get",
        `http://212.22.94.121:8080/api/params/${id}/values?from=${from}&to=${to}`
      );

      console.log(responseData);

      if (!responseData.data.length) {
        setFloorText("Ничего не найдено!");

        return setOpenFloorWind(true);
      }

      // const _instant = new Date(
      //   new Date(responseData.data[0].instant).getTime() - 300000
      // )
      //   .toLocaleString()
      //   .split(", ")
      //   .map((_l, index) =>
      //     index === 0 ? _l.split(".").reverse().join("-") : _l
      //   );

      // const _to = new Date(new Date(to).getTime())
      //   .toLocaleString()
      //   .split(", ")
      //   .map((_l, index) =>
      //     index === 0 ? _l.split(".").reverse().join("-") : _l
      //   );

      // await requestDataForGraphs(_instant, _to);
      await requestDataForGraphs(responseData.data[0].instant, to);

      // setInstantTime(_instant[1]);
      // setMinTime(_instant[1]);

      // setInstantDate(_instant[0]);
      // setMinDate(_instant[0]);

      // setCurrentTime(_to[1]);
      // setMaxTime(_to[1]);

      // setCurrentDate(_to[0]);
      // setMaxDate(_to[0]);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  useEffect(() => {
    requestData();
  }, [requestData]);

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
      <div className="analysis-infomation-wrapper">
        <div className="analysis-infomation">
          <h2 className="analysis-title">{titles[0]}</h2>
          <h2 className="analysis-value">{titles.at(-1)}</h2>
        </div>
        <div className="analysis-date">
          <div className="analysis-date-before">
            <p>Период с</p>
            <input
              type="time"
              value={minTime}
              min={`${instantTime}`}
              max={`${currentTime}`}
              onChange={(event) => setMinTime(event.target.value)}
            />
            <input
              type="date"
              value={minDate}
              min={`${instantDate}`}
              max={`${currentDate}`}
              onChange={(event) => setMinDate(event.target.value)}
            />
          </div>
          <div className="analysis-date-after">
            <p>по</p>
            <input
              type="time"
              value={maxTime}
              min={`${instantTime}`}
              max={`${currentTime}`}
              onChange={(event) => setMaxTime(event.target.value)}
            />
            <input
              type="date"
              value={maxDate}
              min={`${instantDate}`}
              max={`${currentDate}`}
              onChange={(event) => setMaxDate(event.target.value)}
            />
          </div>
        </div>
        <SmallButton>Применить</SmallButton>
      </div>
      <div className="analysis-result">
        <h2>Результаты</h2>
        {loadingDoughnut ? (
          <LoadingDoughnut />
        ) : (
          <div className="chart-wrapper-doughnut">
            <div className="doughnut">
              <Doughnut data={doughnutGraphData} options={options}></Doughnut>
            </div>
            <div className="doughnut-infomation">
              <div className="red-wrapper">
                <div className="red"></div>
                <p>Критические ошибки: {unPassedTests}</p>
              </div>
              <div className="yellow-wrapper">
                <div className="yellow"></div>
                <p>Допустимые ошибки: {passedTests}</p>
              </div>
            </div>
          </div>
        )}
        {loadingHist ? (
          <LoadingHist />
        ) : (
          <div className="chart-wrapper-hist">
            <div className="hist">
              <Bar data={histGraphData} options={options}></Bar>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisPage;
