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

import "./RealTimeGraph.scss";

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

let eventSource = new EventSource(
  `http://212.22.94.121:8080/api/params/graph/hist/sse?paramId=1&bandAmount=1&period=1&depth=1`
);

const graphKeyX = "graphDataX";
const graphKeyY = "graphDataY";
const graphKeyMin = "graphMin";
const graphKeyMax = "graphMax";

const RealTimeGraph = ({ id, pattern, threshold, depth }) => {
  const { request } = useHTTP();

  const { getOneTimeAndDate } = useSortDate();
  const [timeValue, setTimeValue] = useState(5);

  const [xData, setXData] = useState(
    JSON.parse(localStorage.getItem(graphKeyX))
  );
  const [yData, setYData] = useState(
    JSON.parse(localStorage.getItem(graphKeyY))
  );
  const [xDataContinue, setXDataContinue] = useState([]);
  const [yDataContinue, setYDataContinue] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(20);

  const data = {
    labels: xData,
    datasets: [
      {
        label: `${pattern}-${
          String(pattern).split("")[2] == 3 ? "ие" : "ые"
        } ошибки за последние ${timeValue} секунд`,
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
        `http://212.22.94.121:8080/api/params/${id}/values/start-test-generation?timeout=6&interval=5&min=1&max=6`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const realTime = useCallback(async () => {
    try {
      let _xData = JSON.parse(localStorage.getItem(graphKeyX));
      let _yData = JSON.parse(localStorage.getItem(graphKeyY));

      setMin(localStorage.getItem(graphKeyMin));
      setMax(localStorage.getItem(graphKeyMax));

      let j = 0;

      eventSource.onmessage = async (event) => {
        const _data = JSON.parse(event.data);

        const keys = Object.keys(_data);

        // await requestByCreateData();

        const sortKeys = keys
          .map((first) => first.split(","))
          .flat(1)
          .sort((left, right) => new Date(right) - new Date(left));

        const _key = keys.find((first) =>
          first.split(",").includes(sortKeys[0])
        );

        const time = getOneTimeAndDate(_key);
        let maxValue = Number(_data[keys.at(-1)]);

        if (_xData.length >= 4) {
          _xData.push(time);
          _yData.push(maxValue);

          setXDataContinue(_xData);
          setYDataContinue(_yData);

          setMin(j + min);
          setMax(j + max);

          localStorage.setItem(
            graphKeyX,
            JSON.stringify(
              _xData.length > 4
                ? _xData.slice(_xData.length - 5, _xData.length - 1)
                : xData
            )
          );

          localStorage.setItem(
            graphKeyY,
            JSON.stringify(
              _yData.length > 4
                ? _yData.slice(_yData.length - 5, _yData.length - 1)
                : yData
            )
          );

          localStorage.setItem(graphKeyMin, min);
          localStorage.setItem(graphKeyMax, max);

          ++j;
        }

        if (_xData.length < 4) {
          _xData.push(time);
          _yData.push(maxValue);

          setXDataContinue(_xData);
          setYDataContinue(_yData);

          localStorage.setItem(graphKeyX, JSON.stringify(xData));
          localStorage.setItem(graphKeyY, JSON.stringify(yData));

          localStorage.setItem(graphKeyMin, min);
          localStorage.setItem(graphKeyMax, max);
        }
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  const runRealTime = useCallback(async (_threshold, _depth, _period) => {
    try {
      eventSource = new EventSource(
        `http://212.22.94.121:8080/api/params/graph/hist/sse?paramId=${id}&bandAmount=${_threshold}&period=${_period}&depth=${_depth}`
      );

      await realTime();
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    eventSource.close();

    setXData(JSON.parse(localStorage.getItem(graphKeyX)));

    setYData(JSON.parse(localStorage.getItem(graphKeyY)));

    if (threshold && depth) {
      runRealTime(threshold, depth, timeValue);
    }
  }, [threshold, depth, timeValue]);

  useEffect(() => {
    setXData(xDataContinue);
    setYData(yDataContinue);
  }, [xDataContinue, yDataContinue]);

  useEffect(() => {
    localStorage.setItem(graphKeyX, JSON.stringify([]));
    localStorage.setItem(graphKeyY, JSON.stringify([]));
    localStorage.setItem(graphKeyMin, 0);
    localStorage.setItem(graphKeyMax, 20);
  }, []);

  return (
    <div className="chart-wrapper-real">
      <Line data={data} options={options} />
      <div className="select-time-wrapper">
        <p>Выберите необходимый интервал</p>
        <select
          name="select-time"
          id="select-time"
          className="select-time"
          value={timeValue}
          onChange={(event) => setTimeValue(event.target.value)}
        >
          <option value="2">2 секунды</option>
          <option value="5">5 секунд</option>
          <option value="10">10 секунд</option>
          <option value="30">30 секунд</option>
        </select>
      </div>
    </div>
  );
};

export default RealTimeGraph;
