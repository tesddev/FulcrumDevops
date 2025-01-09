import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../api/axiosInstance.config";
import useNotification from "./useNotification";
import { endpoints } from "../api/endpoints";

const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const { onNotify } = useNotification();

  // Memoize the fetchDashboardData function
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const userResponse = await axiosInstance.get(endpoints.dashboard.userCount, {
        headers: {
          Authorization: endpoints.bearerToken,
        },
      });

      const productResponse = await axiosInstance.get(endpoints.dashboard.productCount, {
        headers: {
          Authorization: endpoints.bearerToken,
        },
      });

      setLoading(false);

      if (userResponse.data?.responseCode === "00" && productResponse.data?.responseCode === "00") {
        setUserCount(userResponse.data?.data?.totalUsers);
        setProductCount(productResponse.data?.data?.totalProducts);
      } else {
        onNotify("error", "Failed to Load Dashboard Data");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      onNotify("error", "Error occurred while fetching dashboard data", error.response?.data?.responseMessage);
    }
  }, [onNotify]);

  // Use the memoized fetchDashboardData in useEffect
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    userCount,
    productCount,
    loading,
  };
};

export default useDashboard;
