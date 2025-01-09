import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../api/axiosInstance.config";
import { endpoints } from "../api/endpoints";
import useNotification from "./useNotification";

const useGetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { onNotify } = useNotification();

  // Memoize the fetchUsers function to avoid re-creating it on every render
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoints.users.getAllUsers, {
        headers: {
          Authorization: endpoints.bearerToken,
        },
      });

      if (response.data?.responseCode === "00") {
        // Check if the fetched data is different from the current state to avoid unnecessary updates
        setUsers(prevUsers => {
          const newUsers = response.data.data.users || [];
          if (JSON.stringify(newUsers) !== JSON.stringify(prevUsers)) {
            return newUsers;
          }
          return prevUsers;
        });
      } else {
        onNotify("error", "Error occurred", response?.data?.responseMessage);
      }
    } catch (error) {
      console.error(error);
      onNotify("error", "Error occurred", error.response?.data?.responseMessage || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  // Fetch users when the component mounts or when fetchUsers changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, fetchUsers };
};

export default useGetAllUsers;
