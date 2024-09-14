import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { Button } from "./ui/button";
import { fetchLanguages, searchLanguages } from "./api/languages-api";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Input } from "./ui/input";

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
	const [searchTerm, setSearchTerm] = useState<string>("");

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	const loadAllLanguages = async () => {
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

	useEffect(() => {
		loadAllLanguages(); // Load all languages on initial render
	}, [token]);

	useEffect(() => {
		const searchForLanguages = async () => {
			try {
				if (token && searchTerm) {
					const fetchedLanguages = await searchLanguages(token, searchTerm);
					setLanguages(fetchedLanguages); // Update the table with search results
				}
			} catch (err) {
				setError("Failed to search programming languages");
			}
		};

		if (searchTerm) {
			searchForLanguages();
		} else {
			loadAllLanguages(); // Reload all languages if search term is cleared
		}
	}, [token, searchTerm]);

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

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value); // Update search term when typing
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl">Programming Languages List</h1>
			{token ? <Logout token={token} clearToken={clearToken} /> : null}

			<div className="my-4">
				<Input
					type="text"
					placeholder="Search for a programming language..."
					value={searchTerm}
					onChange={handleSearchChange}
					className="w-full p-2 border rounded"
				/>
			</div>

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
				<p>No results found for "{searchTerm}"</p> // Display message if no results
			)}

			<Button onClick={() => window.location.reload()} className="mt-6">
				Reload Languages
			</Button>
		</div>
	);
};
