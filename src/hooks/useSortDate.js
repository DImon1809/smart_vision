export const useSortDate = () => {
  const getCleanerDate = (_date, width) => {
    let mounth = _date[0].split(".");
    let time = _date[1].split(":");

    mounth = [mounth[0], mounth[1]].join(".");
    time = [time[0], time[1]].join(":");

    return width < 434 ? time : [mounth, time].join(" ");
  };

  const getMinutsAndSeconds = (time) => {
    time = time.split(":");

    return [time[1], time[2]].join(":");
  };

  const sortDate = (_errorsX, width) => {
    let _arrDates = _errorsX
      .map((first) => first.split(","))
      .sort((left, right) => new Date(left[0]) - new Date(right[0]));

    let resultArrDates = [];

    for (let i = 0; i < _arrDates.length; i++) {
      let left = new Date(_arrDates[i][0]).toLocaleString().split(", ");
      let right = new Date(_arrDates[i][1]).toLocaleString().split(", ");

      resultArrDates.push([
        getCleanerDate(left, width),
        "\t",
        getCleanerDate(right, width),
      ]);
    }

    return resultArrDates;
  };

  const getTimeAndDate = (instant, to) => {
    let [minDate, minTime] = new Date(instant).toLocaleString().split(", ");

    let [maxDate, maxTime] = new Date(to).toLocaleString().split(", ");

    minDate = minDate.split(".").reverse().join("-");

    maxDate = maxDate.split(".").reverse().join("-");

    return { minTime, maxTime, minDate, maxDate };
  };

  const getOneTimeAndDate = (_date) => {
    let [_, right] = _date.split(",");
    let [__, time] = new Date(right).toLocaleString().split(", ");

    return getMinutsAndSeconds(time);
  };

  return { sortDate, getTimeAndDate, getOneTimeAndDate };
};
