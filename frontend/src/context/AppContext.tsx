/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type React from "react";
import type { User } from "@/types";

interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    clearUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
    children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    function clearUser() {
        setUser(null);
    }

    const contextValue: AppContextType = {
        user,
        setUser,
        clearUser
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used inside AppContextProvider");
    }
    return context;
}