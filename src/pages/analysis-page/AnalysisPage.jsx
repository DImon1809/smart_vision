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
          histData.reduce((acc, prev) => (acc > prev ? acc : prev), 0) * 1.1,
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

      setUnPassedTests(responseDoughnut.data[id]);

      const responseHist = await axios({
        method: "post",
        url: `http://212.22.94.121:8080/api/params/graph/hist`,
        data: {
          paramId: id,
          startTime: _instant,
          endTime: _to,
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

      setMinTime(
        _instant
          .split("T")
          .map((first, firstIndex) =>
            firstIndex === 1
              ? first
                  .split(".")[0]
                  .split(":")
                  .map((second, secondIndex) =>
                    secondIndex === 0 ? Number(second) + 3 : second
                  )
                  .join(":")
              : first
          )
          .at(-1)
      );

      setMinDate(_instant.split("T")[0]);

      setMaxTime(
        _to
          .split("T")
          .map((first, firstIndex) =>
            firstIndex === 1
              ? first
                  .split(".")[0]
                  .split(":")
                  .map((second, secondIndex) =>
                    secondIndex === 0 ? Number(second) + 3 : second
                  )
                  .join(":")
              : first
          )
          .at(-1)
      );

      setMaxDate(_to.split("T")[0]);

      if (responseDoughnut.data[id] === 0) {
        setFloorText("Данные за указанное время не были найдены!");
        setOpenFloorWind(true);
      }
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

      const _titles = responseTitles.data.filter((_l) => _l.id === Number(id));

      setTitles([_titles[0].name, _titles[0].collectorUrl]);

      const responseData = await request(
        "get",
        `http://212.22.94.121:8080/api/params/${id}/values?from=${from}&to=${to}`
      );

      if (!responseData.data.length) {
        setFloorText("Ничего не найдено!");

        return setOpenFloorWind(true);
      }

      const data = responseData.data.filter(
        (_l) => _l.paramId === Number(id)
      )[0];

      return await requestDataForGraphs(data.instant, to);
    } catch (err) {
      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  const onClickSmallButton = async () => {
    try {
      await requestDataForGraphs(
        new Date(`${minDate} ${minTime}`).toISOString(),
        new Date(`${maxDate} ${maxTime}`).toISOString()
      );
    } catch (err) {
      console.error(err);
    }
  };

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
              onChange={(event) => setMinTime(event.target.value)}
            />
            <input
              type="date"
              value={minDate}
              onChange={(event) => setMinDate(event.target.value)}
            />
          </div>
          <div className="analysis-date-after">
            <p>по</p>
            <input
              type="time"
              value={maxTime}
              onChange={(event) => setMaxTime(event.target.value)}
            />
            <input
              type="date"
              value={maxDate}
              onChange={(event) => setMaxDate(event.target.value)}
            />
          </div>
        </div>
        <SmallButton requestDataForGraphs={onClickSmallButton}>
          Применить
        </SmallButton>
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
