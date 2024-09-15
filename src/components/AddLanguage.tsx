import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addNewLanguage } from "./api/languages-api";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "./ui/form";
import { useForm, FormProvider } from "react-hook-form"; // Pentru validare

interface FormValues {
	name: string;
	creator: string;
	releaseYear: number;
	paradigm: string;
	popularity: number;
}

export const AddNewLanguagePage: React.FC = () => {
	const navigate = useNavigate();

	// Folosim useForm din react-hook-form pentru validare și gestionare formular
	const methods = useForm<FormValues>(); // Folosim toate funcțiile din useForm
	const {
		handleSubmit,
		formState: { errors },
	} = methods;

	const onSubmit = async (data: FormValues) => {
		try {
			const newLanguage = {
				name: data.name,
				creator: data.creator,
				releaseYear: Number(data.releaseYear),
				paradigm: data.paradigm,
				popularity: Number(data.popularity),
			};
			await addNewLanguage(newLanguage); // POST request la backend
			navigate("/programming-languages"); // Navighează înapoi la HomePage după succes
		} catch (err) {
			console.error("Failed to add new language", err);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl mb-4">Add New Programming Language</h1>

			{/* Folosim FormProvider pentru a transmite contextul */}
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Language Name */}
					<FormField
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Language Name</FormLabel>
								<FormControl>
									<Input placeholder="Language Name" {...field} />
								</FormControl>
								<FormMessage>{errors.name?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/* Creator */}
					<FormField
						name="creator"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Creator</FormLabel>
								<FormControl>
									<Input placeholder="Creator" {...field} />
								</FormControl>
								<FormMessage>{errors.creator?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/* Release Year */}
					<FormField
						name="releaseYear"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Release Year</FormLabel>
								<FormControl>
									<Input type="number" placeholder="Release Year" {...field} />
								</FormControl>
								<FormMessage>{errors.releaseYear?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/* Paradigm */}
					<FormField
						name="paradigm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Paradigm</FormLabel>
								<FormControl>
									<Input placeholder="Paradigm" {...field} />
								</FormControl>
								<FormMessage>{errors.paradigm?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<FormField
						name="popularity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Popularity (%)</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Popularity (%)"
										{...field}
									/>
								</FormControl>
								<FormMessage>{errors.popularity?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full p-2">
						Add Language
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};
