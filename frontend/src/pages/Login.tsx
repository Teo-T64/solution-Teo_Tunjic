import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosConfig from "../util/axiosConfig";
import { useApp } from "../context/AppContext";
import { API_ENDPOINTS } from "@/util/apiEndpoints";
import axios from "axios";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword,setShowPassword] = useState<boolean>(false);

    function toggleShowPassword(){
        setShowPassword(!showPassword);
    }
    const navigate = useNavigate();
    const { setUser } = useApp();

    const handleLogin = async (e: React.ChangeEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Invalid credentials provided");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                username,
                password,
            });

            if (res.data && res.data.accessToken) {
                
                localStorage.setItem("token", res.data.accessToken);
                
            if (res.data.user) {
                setUser(res.data.user);
            }

            toast.success("Successfully logged in!");
            navigate("/products"); 
        }
        } catch (error) {
            console.error("Login error:", error);
            let errorMsg = "Wrong username or password";

            if (axios.isAxiosError(error)) {
                errorMsg = error.response?.data?.message || errorMsg;
            } else if (error instanceof Error) {
                errorMsg = error.message;
            }

            toast.error(errorMsg);
        }finally {
          setIsLoading(false); 
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Login</CardTitle>
            <CardDescription>
                Login to your account
            </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 p-4">
                <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="JohnDoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    {
                        showPassword ?  <EyeIcon onClick={toggleShowPassword} className="cursor-pointer" size={25}/> : <EyeClosedIcon onClick={toggleShowPassword} className="cursor-pointer" size={25}/> 
                    }

                </div>
                </div>
            </CardContent>
            
            <CardFooter>
                <Button 
                type="submit" 
                className="w-full p-5.5 font-medium cursor-pointer" 
                disabled={isLoading}
                >
                {isLoading ? "Logging in..." : "Login"}
                </Button>
            </CardFooter>
            </form>
        </Card>
        </div>
    );
}

export default Login;