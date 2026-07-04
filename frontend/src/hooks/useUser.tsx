import { useEffect } from "react";
import { useApp } from "../context/AppContext"; 
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import type { User } from "@/types"; 

function useUser(): void {
  const { user, setUser, clearUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearUser();
      navigate("/login");
      return;
    }

    if (user) {
      return;
    }

    let isMounted: boolean = true;

    async function fetchUserInfo(): Promise<void> {
      try {
        const res = await axiosConfig.get<User>(API_ENDPOINTS.GET_USER);
        
        if (isMounted && res.data) {
          setUser(res.data); 
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        if (isMounted) {
          clearUser();
          localStorage.removeItem("token"); 
          navigate("/login");
        }
      }
    }

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [setUser, clearUser, navigate, user]); 
}

export default useUser;