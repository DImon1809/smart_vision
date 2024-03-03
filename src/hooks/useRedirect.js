import React, { useEffect, useState } from "react";

const redirectKey = "redirect";

export const useRedirect = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {});

  const onClickStartButton = () => {
    setRedirect(true);
    localStorage.setItem(redirectKey, redirect);
  };
};
