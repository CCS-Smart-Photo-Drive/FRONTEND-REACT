import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export function VerifyLogin() { 
    const navigate = useNavigate();
    useEffect(() => {
    (async () => {
        const query = new URLSearchParams(location.search);
        const jwtToken = query.get('token');
        const isAdmin = localStorage.getItem("attempted_admin_login") === "true";
        localStorage.removeItem("attempted_admin_login");

        const response = await fetch(`${API_URL}/auth_${isAdmin ? 'admin' : 'user'}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
        });
        if (!response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("user_name");
            localStorage.removeItem("email");
            localStorage.removeItem("is_admin");
            return;
        }
        const data = await response.json();
        // { user: { user_name, email, is_admin(bool) }, token}

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_name", data.user.user_name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("is_admin", data.user.is_admin);
        navigate(data.user.is_admin ? "/manager_dashboard" : "/profile");
    })()
    }, []);
    return <div>Logging in</div>;
}