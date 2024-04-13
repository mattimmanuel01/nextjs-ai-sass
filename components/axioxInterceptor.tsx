"use client";

import axios from "axios";
import { useEffect } from "react";
import { useProModal } from "@/hooks/use-pro-modal";

const AxiosInterceptor = () => {
  const proModal = useProModal();

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 403) {
          console.log("whooops");
          proModal.onOpen();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up the interceptor when the component unmounts
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, [proModal]);

  return null; // This component doesn't render anything
};

export default AxiosInterceptor;
