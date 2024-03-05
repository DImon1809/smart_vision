export const useSortDate = () => {
  const sortDate = (_errorsX) => {
    let _t = _errorsX
      .map((first) =>
        first
          .split(",")
          .map((second) => String(new Date(second)).split(" ").slice(1, 5))
      )
      .flat(1);

    let _res = [];

    for (let i = 1; i < _t.length; i += 2) {
      let count = Number(
        _t[i - 1][3]
          .split(":")
          .map((_l, index) => (index !== 2 ? _l : ""))
          .filter((_l) => _l !== "")
          .join("")
      );

      _res.push([
        count,
        [
          _t[i - 1][1],
          _t[i - 1][0],
          _t[i - 1][3]
            .split(":")
            .map((_l, index) => (index !== 2 ? _l : ""))
            .filter((_l) => _l !== "")
            .join(":"),
        ].join(" "),
        "\t",
        [
          _t[i][1],
          _t[i][0],
          _t[i][3]
            .split(":")
            .map((_l, index) => (index !== 2 ? _l : ""))
            .filter((_l) => _l !== "")
            .join(":"),
        ].join(" "),
      ]);
    }

    _t = _res
      .sort((left, right) => left[0] - right[0])
      .map((_l) => _l.slice(1, _l.length));

    return _t;
  };

  return { sortDate };
};
