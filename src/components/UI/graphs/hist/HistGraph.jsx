import React, { useState, useEffect, useCallback } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useHTTP } from "../../../../hooks/useHTTP";
import { useSortDate } from "../../../../hooks/useSortDate";
import { useGetDate } from "../../../../hooks/useGetDate";

import LoadingHist from "../loading-graph/LoadingHist";

import "./HistGraph.scss";

import refresh from "../../../../font/refresh.png";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const HistGraph = ({
  pattern,
  forHistRequest,
  setDateAndTimes,
  setOpenFloorWind,
  setFloorText,
}) => {
  const { request } = useHTTP();

  const { sortDate, getTimeAndDate } = useSortDate();
  const { getFromAndToDate } = useGetDate();

  const [loadingHist, setLoadingHist] = useState(true);
  const [refreshActive, setRefreshActive] = useState(false);
  const [existsData, setExistsData] = useState(true);

  const [histLabel, setHistLabel] = useState([]);
  const [histData, setHistData] = useState([]);

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
  };

  const histGraphData = {
    labels: histLabel,
    datasets: [
      {
        label: `${pattern}-${
          String(pattern).split("")[2] == 3 ? "ие" : "ые"
        } ошибки`,
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

  const sleep = async (time) =>
    new Promise((resolve) => setTimeout(() => resolve(true), time));

  const requestData = useCallback(async (id, instant, to) => {
    try {
      const response = await request(
        "post",
        `http://212.22.94.121:8080/api/params/graph/hist`,
        {
          paramId: id,
          startTime: instant,
          endTime: to,
          bandAmount: 5,
        }
      );

      setLoadingHist(false);

      const _errorsX = Object.keys(response.data);

      const _errorsY = [];

      for (let item of _errorsX) {
        _errorsY.push(response.data[item]);
      }

      setHistLabel(sortDate(_errorsX, window.screen.width));

      setHistData(_errorsY);

      setDateAndTimes(getTimeAndDate(instant, to));

      if (_errorsY.every((_l) => Number(_l) === 0)) setExistsData(false);
    } catch (err) {
      setLoadingHist(true);

      setFloorText("Что-то пошло не так!");
      setOpenFloorWind(true);

      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!forHistRequest.instant || !forHistRequest.to) return;

    requestData(forHistRequest.id, forHistRequest.instant, forHistRequest.to);
  }, [forHistRequest]);

  useEffect(() => {
    if (!existsData) {
      setTimeout(() => {
        setLoadingHist(false);

        setFloorText("Данные за указанный период не найдены!");
        setOpenFloorWind(true);
      }, 2000);
    }
  }, [existsData]);

  return (
    <>
      {loadingHist ? (
        <LoadingHist />
      ) : (
        <div className="chart-wrapper-hist">
          <img
            src={refresh}
            alt="#"
            className={refreshActive ? "refresh active" : "refresh"}
            onClick={async () => {
              setRefreshActive(true);

              await sleep(1000);

              await requestData(
                forHistRequest.id,
                forHistRequest.instant,
                getFromAndToDate().to
              );

              setRefreshActive(false);
            }}
          />
          <div className="hist">
            <Bar data={histGraphData} options={options}></Bar>
          </div>
        </div>
      )}
    </>
  );
};

export default HistGraph;
