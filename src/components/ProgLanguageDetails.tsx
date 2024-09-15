import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLanguageById } from "./api/languages-api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProgrammingLanguage {
	id: number;
	name: string;
	creator: string;
	releaseYear: number;
	paradigm: string;
	popularity: number;
}

const ProgrammingLanguageDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>(); // Obținem id-ul din URL
	const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const token = localStorage.getItem("token"); // Tokenul utilizatorului

	useEffect(() => {
		const loadLanguage = async () => {
			try {
				if (token) {
					const fetchedLanguage = await fetchLanguageById(Number(id), token);
					setLanguage(fetchedLanguage);
				}
				setLoading(false);
			} catch (error) {
				setError("Failed to fetch programming language details.");
				setLoading(false);
			}
		};

		loadLanguage();
	}, [id, token]);

	if (loading) {
		return <p>Loading language details...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	if (!language) {
		return <p>Programming language not found.</p>;
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<Card>
				<CardHeader>
					<CardTitle className="text-center">Programming Language Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<p>
					<strong>Name:</strong> {language.name}
					</p>
					<p>
					<strong>Creator:</strong> {language.creator}
					</p>
					<p>
					<strong>Release Year:</strong> {language.releaseYear}
					</p>
					<p>
					<strong>Paradigm:</strong> {language.paradigm}
					</p>
					<p>
					<strong>Popularity:</strong> {language.popularity}%
					</p>
				</CardContent>
			</Card>
		</div>


	);
};

export default ProgrammingLanguageDetails;
