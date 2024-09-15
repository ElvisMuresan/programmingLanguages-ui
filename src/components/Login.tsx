import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { loginUser } from "./api/languages-api";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(5, {
		message: "Password must be at least 5 characters.",
	}),
});

export function Login() {
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/programming-languages");
		}
	}, [navigate]);

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		try {
			const response = await loginUser(values.username, values.password);

			if (response && response.token) {
				localStorage.setItem("token", response.token);
				localStorage.setItem("username", response.username);

				setError(null);
				console.log("Login successful!", response);
				navigate("/programming-languages");
			} else {
				console.log("Full response", response);
				setError("Login failed. Invalid response from server.");
			}
		} catch (error) {
			setError("Username or password invalid. Please try again.");
			console.error("Login error: ", error);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="Enter your username" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{error && <p className="text-red-500">{error}</p>}{" "}
							<Button type="submit" className="w-full">
								Login
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
