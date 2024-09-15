import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Login } from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { HomePage } from "./components/HomePage";
import ProgrammingLanguageDetails from "./components/ProgLanguageDetails";
import { AddNewLanguagePage } from "./components/AddLanguage";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Router>
				<div className="min-h-screen flex flex-col ">
					<header className="p-4 bg-gray-100 dark:bg-card">
						<div className="container mx-auto flex justify-end">
							<ModeToggle />
						</div>
					</header>

					<main className="flex-1">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route
								path="/programming-languages"
								element={
									<PrivateRoute>
										<HomePage />
									</PrivateRoute>
								}
							/>
							<Route
								path="/programming-languages/:id"
								element={
									<PrivateRoute>
										<ProgrammingLanguageDetails />
									</PrivateRoute>
								}
							/>

							<Route
								path="/add-new-language"
								element={
									<PrivateRoute>
										<AddNewLanguagePage />
									</PrivateRoute>
								}
							/>
							<Route path="*" element={<Navigate to="/login" />} />
						</Routes>
					</main>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
