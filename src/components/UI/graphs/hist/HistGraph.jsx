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

import LoadingHist from "../loading-graph/LoadingHist";

import "./HistGraph.scss";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const HistGraph = ({
  forHistRequest,
  setDateAndTimes,
  setOpenFloorWind,
  setFloorText,
}) => {
  const { request } = useHTTP();

  const { sortDate, getTimeAndDate } = useSortDate();

  const [loadingHist, setLoadingHist] = useState(true);

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

      // console.log(response);

      setLoadingHist(false);

      const _errorsX = Object.keys(response.data);

      const _errorsY = [];

      for (let item of _errorsX) {
        _errorsY.push(response.data[item]);
      }

      setHistLabel(sortDate(_errorsX));

      setHistData(_errorsY);

      setDateAndTimes(getTimeAndDate(instant, to));

      if (_errorsY.every((_l) => Number(_l) === 0)) {
        setLoadingHist(false);

        setFloorText("Данные за указанный период не найдены!");
        setOpenFloorWind(true);
      }
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

  return (
    <>
      {loadingHist ? (
        <LoadingHist />
      ) : (
        <div className="chart-wrapper-hist">
          <div className="hist">
            <Bar data={histGraphData} options={options}></Bar>
          </div>
        </div>
      )}
    </>
  );
};

export default HistGraph;
