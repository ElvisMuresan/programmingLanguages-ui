import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./api/languages-api";
import { Button } from "./ui/button";

interface LogoutProps {
	token: string;
	clearToken: () => void;
}

const Logout: React.FC<LogoutProps> = ({ token, clearToken }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			console.log("Token used for logout:", token);
			await logoutUser(token);
			clearToken();
			localStorage.removeItem("token");
			localStorage.removeItem("username");
			navigate("/login");
		} catch (err) {
			console.error("Logout failed", err);
		}
	};

	return (
		<Button
			onClick={handleLogout}
		>
			Logout
		</Button>
	);
};

export default Logout;
