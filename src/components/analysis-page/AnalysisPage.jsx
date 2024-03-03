import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Button from "../UI/Button";

import "./AnalysisPage.scss";

Chart.register(ArcElement, Tooltip, Legend);

const AnalysisPage = () => {
  const data = {
    labels: [],
    datasets: [
      {
        label: "Ошибки",
        data: [21, 9],
        backgroundColor: ["yellow", "#E30000"],
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
  };

  return (
    <section className="analysis-section">
      <div className="analysis-infomation-wrapper">
        <div className="analysis-infomation">
          <h2 className="analysis-title">Тест сайта</h2>
          <h2 className="analysis-value">http://45.9.40.156:4000/</h2>
        </div>
        <div className="analysis-date">
          <div className="analysis-date-before">
            <p>Период с</p>
            <input type="time" />
            <input type="date" />
          </div>
          <div className="analysis-date-after">
            <p>по</p>
            <input type="time" />
            <input type="date" />
          </div>
        </div>
        <Button>Применить</Button>
      </div>
      <div className="analysis-result">
        <h2>Результаты</h2>
        <div className="chart-wrapper">
          <div className="chart">
            <Doughnut data={data} options={options}></Doughnut>
          </div>
          <div className="chart-infomation">
            <div className="red-wrapper">
              <div className="red"></div>
              <p>Непройденные тесты: 9</p>
            </div>
            <div className="yellow-wrapper">
              <div className="yellow"></div>
              <p>Пройденные с некритическими ошибками тесты: 21</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisPage;
