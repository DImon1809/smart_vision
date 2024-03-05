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

import Button from "../UI/Button";
import FloorWindow from "../floor-window/FloorWindow";

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

  const getFromAndToDate = () => {
    const today = new Date().getTime();

    const from = new Date(today - 432000000).toISOString();
    const to = new Date(today).toISOString();

    return { from, to };
  };

  const requestDataForGraphs = async (_instant, _to) => {
    try {
      const responseDoughnut = await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params/graph/circle`,
        data: {
          paramIds: [id],
          startTime: new Date(_instant.join(" ")).toISOString(),
          endTime: new Date(_to.join(" ")).toISOString(),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

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

      console.error(err);
    }
  };

  const requestData = useCallback(async () => {
    try {
      const { from, to } = getFromAndToDate();

      const responseTitles = await axios({
        method: "get",
        url: `http://212.22.94.121:8080/api/params`,
        data: {},
        headers: {
          "Content-Type": "application/json",
        },
      });

      const _titles = responseTitles.data.filter((_l) => _l.id === +id);

      setTitles([_titles[0].name, _titles[0].collectorUrl]);

      const responseData = await axios({
        method: "get",
        url: `http://212.22.94.121:8080/api/params/${id}/values?from=${from}&to=${to}`,
        data: {},
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseData.data.length) {
        setFloorText("Ничего не найдено!");

        return setOpenFloorWind(true);
      }

      const _instant = new Date(
        new Date(responseData.data[0].instant).getTime() - 300000
      )
        .toLocaleString()
        .split(", ")
        .map((_l, index) =>
          index === 0 ? _l.split(".").reverse().join("-") : _l
        );

      const _to = new Date(new Date(to).getTime())
        .toLocaleString()
        .split(", ")
        .map((_l, index) =>
          index === 0 ? _l.split(".").reverse().join("-") : _l
        );

      await requestDataForGraphs(_instant, _to);

      setInstantTime(_instant[1]);
      setMinTime(_instant[1]);

      setInstantDate(_instant[0]);
      setMinDate(_instant[0]);

      setCurrentTime(_to[1]);
      setMaxTime(_to[1]);

      setCurrentDate(_to[0]);
      setMaxDate(_to[0]);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  useEffect(() => {
    requestData();
  }, []);

  return (
    <section className="analysis-section">
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
        <Button>Применить</Button>

        {openFloorWind && (
          <FloorWindow
            setOpenFloorWind={setOpenFloorWind}
            floorText={floorText}
          />
        )}
      </div>
      <div className="analysis-result">
        <h2>Результаты</h2>
        <div className="chart-wrapper-doughnut">
          <div className="chart">
            <Doughnut data={doughnutGraphData} options={options}></Doughnut>
          </div>
          <div className="chart-infomation">
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
        <div className="chart-wrapper-hist">
          <div className="hist">
            <Bar data={histGraphData} options={options}></Bar>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisPage;
