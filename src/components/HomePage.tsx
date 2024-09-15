import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { Button } from "./ui/button";
import { deleteAllLanguages, deleteLanguage, fetchLanguages, searchLanguages } from "./api/languages-api";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
	const [username, setUsername] = useState<string | null>(null);
	const navigate = useNavigate();
	const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>(""); 
	const [sortOrder, setSortOrder] = useState<string>("asc"); 
	const [triggerSearch, setTriggerSearch] = useState<boolean>(false); 
	const [languageToDelete, setLanguageToDelete] = useState<ProgrammingLanguage | null>(null); 
	const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]); 
	const [selectAll, setSelectAll] = useState<boolean>(false); 
	const [bulkDeleteConfirmation, setBulkDeleteConfirmation] = useState<boolean>(false); 

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		const savedUsername = localStorage.getItem("username");

		if (savedToken && savedUsername) {
			setToken(savedToken);
			setUsername(savedUsername);
		}
	}, []);

	const loadAllLanguages = async () => {
		try {
			if (token) {
				const fetchedLanguages = await fetchLanguages(token); 
				setLanguages(fetchedLanguages);
				setError(null);
			}
			setLoading(false);
		} catch (err) {
			setError("Failed to load programming languages");
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAllLanguages();
	}, [token]);

	useEffect(() => {
		const searchForLanguages = async () => {
			try {
				if (token && (searchTerm || sortBy)) {
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
			searchForLanguages(); 
		}
	}, [token, searchTerm, sortBy, sortOrder, triggerSearch]);

	const handleSort = (column: string) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
		setTriggerSearch(true); 
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setTriggerSearch(true); 
	};

	const handleAddNewLanguage = () => {
		navigate("/add-new-language"); 
	};

	const handleEdit = (id: number) => {
		navigate(`/programming-languages/edit/${id}`);
	};

	const handleDeleteConfirmation = (language: ProgrammingLanguage) => {
		setLanguageToDelete(language); 
	};

	const handleDelete = async () => {
		if (languageToDelete && token) {
			try {
				await deleteLanguage(languageToDelete.id, token);
				setLanguages(
					languages.filter((lang) => lang.id !== languageToDelete.id),
				);
				setLanguageToDelete(null); 
			} catch (err) {
				console.error("Failed to delete language", err);
			}
		}
	};

	const handleBulkDelete = async () => {
		if (selectedLanguages.length > 0 && token) {
		  try {
			await deleteAllLanguages(selectedLanguages, token);
			setLanguages(
			  languages.filter((lang) => !selectedLanguages.includes(lang.id)),
			);
			setSelectedLanguages([]);
			setSelectAll(false);
			setBulkDeleteConfirmation(false); // Close the bulk delete dialog
		  } catch (err) {
			console.error("Failed to delete selected languages", err);
		  }
		}
	  };
	
	  const handleSelectLanguage = (id: number) => {
		if (selectedLanguages.includes(id)) {
		  setSelectedLanguages(selectedLanguages.filter((langId) => langId !== id));
		} else {
		  setSelectedLanguages([...selectedLanguages, id]);
		}
	  };
	
	  const handleSelectAll = () => {
		if (selectAll) {
		  setSelectedLanguages([]);
		} else {
		  setSelectedLanguages(languages.map((lang) => lang.id));
		}
		setSelectAll(!selectAll);
	  };

	  const user = {
		username,
		fullName: username === 'elvis' ? 'Elvis Muresan' : 'Florin Bejera',
		email: username === 'elvis' ? 'elvis.e.muresan@gmail.com' : 'florinpentru0306@gmail.com',
	  };

	if (loading) {
		return <p>Loading programming languages...</p>;
	}

	return (
		<div className="container mx-auto p-4">
			{token ? (
				<div className="absolute top-4 right-[250px]">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-4">
								Account
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem className="pointer-events-none">
								<span className="font-bold">{user.fullName}</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="pointer-events-none">
								<span>{user.email}</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Logout token={token} clearToken={() => setToken(null)} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>			
				</div>
) : null}
				

			<div className="flex justify-between items-center mb-4">
				<Input
					type="text"
					placeholder="Search for a programming language..."
					value={searchTerm}
					onChange={handleSearchChange}
					className="w-full p-2 border rounded"
				/>
				{selectedLanguages.length > 0 && (
					<Button onClick={() => setBulkDeleteConfirmation(true)} className="ml-4" variant="destructive">
						Delete Selected
					</Button>
        )}
				<Button onClick={handleAddNewLanguage} className="ml-4">
					Add New Language
				</Button>
			</div>

			{languages.length > 0 ? (
				<Table>
					<TableCaption>A list of programming languages.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">
								<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
							</TableHead>
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
								<TableCell onClick={(e) => e.stopPropagation()}>
									<Checkbox
									checked={selectedLanguages.includes(language.id)}
									onCheckedChange={() => handleSelectLanguage(language.id)}
									/>
              					</TableCell>
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
										variant="outline"
										className="text-blue-600"
									>
										Edit
									</Button>
									<Button
										onClick={() => handleDeleteConfirmation(language)}
										variant="destructive"
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p>No results found for "{searchTerm}"</p>
			)}

			<Dialog
				open={!!languageToDelete}
				onOpenChange={() => setLanguageToDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete {languageToDelete?.name}?</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this language? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setLanguageToDelete(null)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Bulk Delete Confirmation Dialog */}
			<Dialog
				open={bulkDeleteConfirmation}
				onOpenChange={() => setBulkDeleteConfirmation(false)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Selected Languages?</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the selected languages? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setBulkDeleteConfirmation(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleBulkDelete}>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Button onClick={() => window.location.reload()} className="mt-6">
				Reload Languages
			</Button>
		</div>
	);
};
