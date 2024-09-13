import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { Button } from "./ui/button";
import { fetchLanguages } from "./api/languages-api";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface ProgrammingLanguage {
	id: number;
	name: string;
	creator: string;
	releaseYear: number;
	paradigm: string;
	popularity: number;
}

export const HomePage: React.FC = () => {
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();
	const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	useEffect(() => {
		const loadLanguages = async () => {
			try {
				if (token) {
					const fetchedLanguages = await fetchLanguages(token);
					setLanguages(fetchedLanguages);
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to load programming languages");
				setLoading(false);
			}
		};

		loadLanguages();
	}, [token]);

	if (loading) {
		return <p>Loading programming languages...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	const clearToken = () => {
		setToken(null);
	};

	const handleRowClick = (id: number) => {
		navigate(`/programming-languages/${id}`);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl">Programming Languages List</h1>
			{token ? <Logout token={token} clearToken={clearToken} /> : null}

			{languages.length > 0 ? (
				<Table>
					<TableCaption>A list of programming languages.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Creator</TableHead>
							<TableHead>Release Year</TableHead>
							<TableHead>Paradigm</TableHead>
							<TableHead className="text-right">Popularity (%)</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{languages.map((language) => (
							<TableRow
								key={language.id}
								onClick={() => handleRowClick(language.id)}
								className="cursor-pointer hover:bg-slate-200"
							>
								<TableCell className="font-medium">{language.id}</TableCell>
								<TableCell>{language.name}</TableCell>
								<TableCell>{language.creator}</TableCell>
								<TableCell>{language.releaseYear}</TableCell>
								<TableCell>{language.paradigm}</TableCell>
								<TableCell className="text-right">
									{language.popularity}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p>No programming languages found</p>
			)}

			<Button onClick={() => window.location.reload()} className="mt-6">
				Reload Languages
			</Button>
		</div>
	);
};
