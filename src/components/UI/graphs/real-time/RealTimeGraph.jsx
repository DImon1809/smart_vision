import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useHTTP } from "../../../../hooks/useHTTP";
import { useSortDate } from "../../../../hooks/useSortDate";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

import "./RealTimeGraph.scss";

const RealTimeGraph = ({ id }) => {
  const { request } = useHTTP();

  const chartRef = useRef();

  const { getOneTimeAndDate } = useSortDate();

  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [xDataContinue, setXDataContinue] = useState([]);
  const [yDataContinue, setYDataContinue] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(20);

  console.log(min);

  const data = {
    labels: xData,
    datasets: [
      {
        label: "Ошибки",
        data: yData,
        pointStyle: false,
        fill: true,
        borderWidth: 1,
        borderColor: "rgba(74, 169, 230, 0.5)",
        backgroundColor: "rgba(74, 169, 230, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        // min: 0,
        // max: 20,
        min,
        max,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(74, 169, 230, 0.9)",
        },

        border: {
          color: "rgba(74, 169, 230, 1)",
        },

        grid: {
          color: "rgba(74, 169, 230, 0.3)",
        },
      },

      y: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(74, 169, 230, 0.9)",
        },

        border: {
          color: "rgba(74, 169, 230, 1)",
        },

        grid: {
          color: "rgba(74, 169, 230, 0.3)",
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },

    animation: {
      duration: 1200,
      easing: "linear",
    },
  };

  const requestByCreateData = async () => {
    try {
      await request(
        "get",
        `http://212.22.94.121:8080/api/params/${id}/values/start-test-generation?timeout=6&interval=5&min=20&max=40`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const requestByStopCreateData = async () => {
    try {
      await request(
        "get",
        `http://212.22.94.121:8080/api/params/${id}/values/stop-test-generation`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const realTime = useCallback(async () => {
    try {
      let _xData = [];
      let _yData = [];
      let j = 0;

      const eventSource = new EventSource(
        `http://212.22.94.121:8080/api/params/graph/hist/sse?paramId=${id}&bandAmount=4&period=5&depth=10`
      );

      eventSource.onmessage = async (event) => {
        const _data = JSON.parse(event.data);

        const keys = Object.keys(_data);

        await requestByCreateData();

        const { maxValue, date } = keys.reduce(
          (acc, prev) =>
            _data[prev] > acc.maxValue
              ? { maxValue: _data[prev], date: prev }
              : acc,
          { maxValue: 0, date: "" }
        );

        const time = getOneTimeAndDate(date);

        if (_xData.length >= 4) {
          _xData.push(time);
          _yData.push(maxValue);

          setXDataContinue(_xData);
          setYDataContinue(_yData);

          setMin(j + min);
          setMax(j + max);

          ++j;
        }

        if (_xData.length < 4) {
          _xData.push(time);
          _yData.push(maxValue);

          setXDataContinue(_xData);
          setYDataContinue(_yData);
        }
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    realTime();
  }, []);

  useEffect(() => {
    setXData(xDataContinue);
    setYData(yDataContinue);
  }, [xDataContinue, yDataContinue]);

  return (
    <div className="chart-wrapper-real">
      <Line data={data} options={options} />
    </div>
  );
};

export default RealTimeGraph;
