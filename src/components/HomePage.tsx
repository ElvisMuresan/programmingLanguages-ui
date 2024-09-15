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
	const [sortBy, setSortBy] = useState<string>(""); // Coloana de sortare
	const [sortOrder, setSortOrder] = useState<string>("asc"); // Ordinea de sortare: asc / desc
	const [triggerSearch, setTriggerSearch] = useState<boolean>(false); // Control pentru declanșarea POST

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	const loadAllLanguages = async () => {
		try {
			if (token) {
				const fetchedLanguages = await fetchLanguages(token); // GET request for initial data
				setLanguages(fetchedLanguages);
				setError(null); // Resetăm eroarea dacă încărcarea este reușită
			}
			setLoading(false);
		} catch (err) {
			setError("Failed to load programming languages");
			setLoading(false);
		}
	};

	// Încărcăm limbajele la inițializare (folosind GET)
	useEffect(() => {
		loadAllLanguages();
	}, [token]);

	// Facem POST doar la search sau sortare
	useEffect(() => {
		const searchForLanguages = async () => {
			try {
				if (token && (searchTerm || sortBy)) {
					// Declanșăm POST doar dacă există searchTerm sau sortare activă
					const fetchedLanguages = await searchLanguages(
						token,
						searchTerm,
						sortBy,
						sortOrder,
					);
					if (fetchedLanguages.length === 0) {
						setError(`No results found for "${searchTerm}"`);
						setLanguages([]);
					} else {
						setLanguages(fetchedLanguages);
						setError(null);
					}
				}
			} catch (err) {
				setError("Failed to search programming languages");
			}
		};

		if (triggerSearch) {
			searchForLanguages(); // POST se declanșează doar dacă triggerSearch este true
		}
	}, [token, searchTerm, sortBy, sortOrder, triggerSearch]);

	const handleSort = (column: string) => {
		if (sortBy === column) {
			// Dacă facem click pe aceeași coloană, inversăm ordinea
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			// Altfel, sortăm crescător pe noua coloană
			setSortBy(column);
			setSortOrder("asc");
		}
		setTriggerSearch(true); // Permitem declanșarea POST pentru sortare
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setTriggerSearch(true); // Permitem declanșarea POST pentru search
	};

	const handleAddNewLanguage = () => {
		navigate("/add-new-language"); // Navighează către pagina de adăugare a limbajului
	};

	const handleEdit = (id: number) => {
		navigate(`/programming-languages/edit/${id}`);
	};

	if (loading) {
		return <p>Loading programming languages...</p>;
	}

	if (error && languages.length === 0) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-2xl">Programming Languages List</h1>
				{token ? (
					<Logout token={token} clearToken={() => setToken(null)} />
				) : null}
				<div className="my-4">
					<Input
						type="text"
						placeholder="Search for a programming language..."
						value={searchTerm}
						onChange={handleSearchChange} // Păstrăm termenul în câmpul de căutare
						className="w-full p-2 border rounded"
					/>
				</div>
				<p>{error}</p> {/* Afișăm mesajul de eroare */}
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl">Programming Languages List</h1>
			{token ? (
				<Logout token={token} clearToken={() => setToken(null)} />
			) : null}

			<div className="flex justify-between items-center mb-4">
				<Input
					type="text"
					placeholder="Search for a programming language..."
					value={searchTerm}
					onChange={handleSearchChange}
					className="w-full p-2 border rounded"
				/>
				<Button onClick={handleAddNewLanguage} className="ml-4">
					Add New Language
				</Button>
			</div>

			{languages.length > 0 ? (
				<Table>
					<TableCaption>A list of programming languages.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]" onClick={() => handleSort("id")}>
								ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead onClick={() => handleSort("name")}>
								Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead onClick={() => handleSort("creator")}>
								Creator{" "}
								{sortBy === "creator" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead onClick={() => handleSort("releaseYear")}>
								Release Year{" "}
								{sortBy === "releaseYear" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead onClick={() => handleSort("paradigm")}>
								Paradigm{" "}
								{sortBy === "paradigm" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead
								className="text-right"
								onClick={() => handleSort("popularity")}
							>
								Popularity (%){" "}
								{sortBy === "popularity" && (sortOrder === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{languages.map((language) => (
							<TableRow
								key={language.id}
								onClick={() =>
									navigate(`/programming-languages/${language.id}`)
								}
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
								<TableCell onClick={(e) => e.stopPropagation()}>
									<Button
										onClick={() => handleEdit(language.id)}
										variant="outline" // Folosim un stil din shadcn-ui
										className="text-blue-600"
									>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p>No results found for "{searchTerm}"</p> // Afișăm mesajul de eroare în locul tabelului
			)}

			<Button onClick={() => window.location.reload()} className="mt-6">
				Reload Languages
			</Button>
		</div>
	);
};
