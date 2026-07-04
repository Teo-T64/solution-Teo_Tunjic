import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { useApp } from "../context/AppContext";
import type { User } from "@/types"; 

function useUser(): void {
    const { user, setUser, clearUser } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            return;
        }

        let isMounted = true;
        
        async function fetchUserInfo() {
            try {
                const res = await axiosConfig.get<User>(API_ENDPOINTS.GET_USER);
                
                if (isMounted && res.data) {
                    setUser(res.data); 
                }
            } catch (error) {
                console.error("Failed to fetch user info", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        }
        
        fetchUserInfo();
        
        return () => {
            isMounted = false;
        };
    }, [user, setUser, clearUser, navigate]); 

}

export default useUser;