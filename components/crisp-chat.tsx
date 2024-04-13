"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("7012cf43-3bbd-4bfe-beff-e20001f732db");
  }, []);

  return null;
};
