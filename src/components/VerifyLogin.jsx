import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export function VerifyLogin() { 
    const navigate = useNavigate();
    useEffect(() => {
    (async () => {
        const query = new URLSearchParams(location.search);
        const jwtToken = query.get('token');

        const response = await fetch(`${API_URL}/sso_auth`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            mode: "cors",
        });
        const data = await response.json();
        // { user: { user_name, email, is_admin(bool), profile_picture (only on login) }, token}

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_name", data.user.user_name);
        localStorage.setItem("email", data.user.email);

        if (data.user.profile_picture) {
            localStorage.setItem("profile_picture", data.user.profile_picture);
        }

        navigate(data.user.is_admin ? "/manager_dashboard" : "/profile");
    })()
    }, []);
    return <div>Logging in</div>;
}