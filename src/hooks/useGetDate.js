export const useGetDate = () => {
  const getFromAndToDate = () => {
    const today = new Date().getTime();

    const from = new Date(today - 10800000).toISOString();
    const to = new Date(today).toISOString();

    return { from, to };
  };

  return { getFromAndToDate };
};
