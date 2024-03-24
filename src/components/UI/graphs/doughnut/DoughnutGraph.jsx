import React, { useEffect, useCallback, useState } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useHTTP } from "../../../../hooks/useHTTP";
import { useGetDate } from "../../../../hooks/useGetDate";

import LoadingDoughnut from "../loading-graph/LoadingDoughnut";
import EmptyBlock from "../../empty-block/EmptyBlock";

import "./DoughnutGraph.scss";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DoughnutGraph = ({ validParams }) => {
  const { request } = useHTTP();
  const { getFromAndToDate } = useGetDate();

  const [loadingDoughnut, setLoadingDoughnut] = useState(true);
  const [data, setData] = useState([]);
  const [params, setParams] = useState([]);
  const [values, setValues] = useState([]);

  const doughnutGraphData = {
    labels: [],
    datasets: [
      {
        label: "Ошибки",
        data,
        backgroundColor: [
          "#008080",
          "#D2691E",
          "#F4A460",
          "#6495ED",
          "#4682B4",
        ],
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
  };

  const requestData = async () => {
    try {
      const arrId = validParams.map((_l) => _l.id);

      const { from, to } = getFromAndToDate();

      const response = await request(
        "post",
        `http://212.22.94.121:8080/api/params/graph/circle`,
        {
          paramIds: arrId,
          startTime: from,
          endTime: to,
        }
      );

      const keys = Object.keys(response.data);

      let _values = [];

      for (let item of keys) {
        _values.push(response.data[item]);
      }

      setParams(validParams.map((_l) => _l.name));
      setValues(_values);

      setData(_values);

      setLoadingDoughnut(false);
    } catch (err) {
      console.error(err);

      setLoadingDoughnut(true);
    }
  };

  useEffect(() => {
    requestData();
  }, [validParams]);

  return (
    <>
      {!validParams.length ? (
        <EmptyBlock>Данных пока нет</EmptyBlock>
      ) : loadingDoughnut ? (
        <LoadingDoughnut />
      ) : (
        <div className="chart-wrapper-doughnut">
          <div className="doughnut">
            <Doughnut data={doughnutGraphData} options={options}></Doughnut>
          </div>
          <div className="doughnut-infomation">
            {params?.[0] ? (
              <div className="item-wrapper">
                <div className="teal"></div>
                <p>{params[0] + " с " + values[0] + " ошибками"}</p>
              </div>
            ) : (
              ""
            )}
            {params?.[1] ? (
              <div className="item-wrapper">
                <div className="chocolate"></div>
                <p>{params[1] + " с " + values[1] + " ошибками"}</p>
              </div>
            ) : (
              ""
            )}
            {params?.[2] ? (
              <div className="item-wrapper">
                <div className="sandy-brown"></div>
                <p>{params[2] + " с " + values[2] + " ошибками"}</p>
              </div>
            ) : (
              ""
            )}
            {params?.[3] ? (
              <div className="item-wrapper">
                <div className="cornflower-blue"></div>
                <p>{params[3] + " с " + values[3] + " ошибками"}</p>
              </div>
            ) : (
              ""
            )}
            {params?.[4] ? (
              <div className="item-wrapper">
                <div className="steel-blue"></div>
                <p>{params[4] + " с " + values[4] + " ошибками"}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DoughnutGraph;
