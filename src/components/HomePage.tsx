import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

export const HomePage = () => {
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();

	// Fetch the token from localStorage when the component mounts
	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	// Function to clear token
	const clearToken = () => {
		setToken(null);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl">Welcome to the Home Page</h1>
			{token ? <Logout token={token} clearToken={clearToken} /> : null}
		</div>
	);
};
