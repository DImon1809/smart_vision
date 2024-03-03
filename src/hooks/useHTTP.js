import React, { useState } from "react";

export const useHTTP = () => {
  const request = async () => {
    try {
      return true;
    } catch (err) {
      console.error(err);
    }
  };

  return { request };
};
