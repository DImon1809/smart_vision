import { useState, useCallback } from "react";
import axios from "axios";

export const useHTTP = () => {
  const [ready, setReady] = useState(true);
  const [errors, setErrors] = useState(false);

  const request = useCallback(
    async (
      method = "get",
      url,
      data = {},
      headers = {
        "Content-Type": "application/json",
      }
    ) => {
      try {
        setReady(false);

        const response = await axios({
          method,
          url,
          data,
          headers,
        });

        setReady(true);
        setErrors(false);

        return response;
      } catch (err) {
        setReady(true);
        setErrors(true);

        console.error(err);
      }
    },
    []
  );

  const clearErrors = () => setErrors(false);

  return { request, ready, errors, clearErrors };
};
