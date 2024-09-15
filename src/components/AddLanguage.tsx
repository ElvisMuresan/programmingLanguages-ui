import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addNewLanguage } from "./api/languages-api";

export const AddNewLanguagePage: React.FC = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [creator, setCreator] = useState("");
	const [releaseYear, setReleaseYear] = useState<number | string>("");
	const [paradigm, setParadigm] = useState("");
	const [popularity, setPopularity] = useState<number | string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const newLanguage = {
				name,
				creator,
				releaseYear: Number(releaseYear),
				paradigm,
				popularity: Number(popularity),
			};
			await addNewLanguage(newLanguage); // POST request to backend
			navigate("/"); // Navighează înapoi la HomePage după succes
		} catch (err) {
			console.error("Failed to add new language", err);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl mb-4">Add New Programming Language</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<Input
						type="text"
						placeholder="Language Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="text"
						placeholder="Creator"
						value={creator}
						onChange={(e) => setCreator(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="number"
						placeholder="Release Year"
						value={releaseYear}
						onChange={(e) => setReleaseYear(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="text"
						placeholder="Paradigm"
						value={paradigm}
						onChange={(e) => setParadigm(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<Input
						type="number"
						placeholder="Popularity (%)"
						value={popularity}
						onChange={(e) => setPopularity(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<Button
					type="submit"
					className="w-full p-2 bg-blue-500 text-white rounded"
				>
					Add Language
				</Button>
			</form>
		</div>
	);
};
