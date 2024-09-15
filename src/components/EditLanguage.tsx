import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { updateLanguage, fetchLanguageById } from "./api/languages-api";

export const EditLanguagePage: React.FC = () => {
	const { id } = useParams(); // ID-ul limbajului pe care îl edităm
	const navigate = useNavigate();
	const token = localStorage.getItem("token"); // Obținem token-ul din localStorage sau altă sursă
	const [language, setLanguage] = useState({
		name: "",
		creator: "",
		releaseYear: "",
		paradigm: "",
		popularity: "",
	});

	useEffect(() => {
		// Fetch language details to populate the form
		const getLanguageDetails = async () => {
			try {
				const fetchedLanguage = await fetchLanguageById(
					Number(id),
					token || "",
				); // Trimitem token-ul în cererea GET
				setLanguage(fetchedLanguage);
			} catch (err) {
				console.error("Failed to fetch language details", err);
			}
		};

		getLanguageDetails();
	}, [id, token]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLanguage((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateLanguage(
				Number(id),
				{
					name: language.name,
					creator: language.creator,
					releaseYear: Number(language.releaseYear), // Ensure this is a number
					paradigm: language.paradigm,
					popularity: Number(language.popularity), // Ensure this is a number
				},
				token || "",
			);
			navigate("/programming-languages"); // Navigăm înapoi la lista principală după editare
		} catch (err) {
			console.error("Failed to update language", err);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl mb-4">Edit Programming Language</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<Input
						type="text"
						name="name"
						placeholder="Language Name"
						value={language.name}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="text"
						name="creator"
						placeholder="Creator"
						value={language.creator}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="number"
						name="releaseYear"
						placeholder="Release Year"
						value={language.releaseYear}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="text"
						name="paradigm"
						placeholder="Paradigm"
						value={language.paradigm}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="number"
						name="popularity"
						placeholder="Popularity (%)"
						value={language.popularity}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<Button
					type="submit"
					className="w-full p-2 bg-blue-500 text-white rounded"
				>
					Save Changes
				</Button>
			</form>
		</div>
	);
};
