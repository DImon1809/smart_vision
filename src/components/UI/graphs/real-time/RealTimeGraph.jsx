import React, { useState, useEffect, useCallback } from "react";
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

  const { getOneTimeAndDate } = useSortDate();

  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [xDataContinue, setXDataContinue] = useState([]);
  const [yDataContinue, setYDataContinue] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(20);

  const data = {
    labels: xData,
    datasets: [
      {
        label: "Ошибки за последние 5 секунд",
        data: yData,
        pointStyle: false,
        fill: true,
        borderWidth: 1,
        borderColor: "rgba(95, 158, 160, 0.5)",
        backgroundColor: "rgba(95, 158, 160, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min,
        max,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(95, 158, 160, 1)",
        },

        border: {
          color: "rgba(95, 158, 160, 1)",
        },

        grid: {
          color: "rgba(95, 158, 160, 0.3)",
        },
      },

      y: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(95, 158, 160, 1)",
        },

        border: {
          color: "rgba(95, 158, 160, 1)",
        },

        grid: {
          color: "rgba(95, 158, 160, 0.3)",
        },
      },
    },

    plugins: {
      legend: {
        display: true,
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
        `http://212.22.94.121:8080/api/params/${id}/values/start-test-generation?timeout=6&interval=5&min=1&max=10`
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

        const sortKeys = keys
          .map((first) => first.split(","))
          .flat(1)
          .sort((left, right) => new Date(right) - new Date(left));

        const _key = keys.find((first) =>
          first.split(",").includes(sortKeys[0])
        );

        const time = getOneTimeAndDate(_key);
        const maxValue = Math.abs(Number(_data[keys.at(-1)]));

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
