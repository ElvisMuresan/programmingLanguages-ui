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
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	creator: z.string().min(2, "Creator must be at least 2 characters."),
	releaseYear: z.coerce
		.number()
		.min(1900, "Release year must be valid.")
		.max(new Date().getFullYear(), "Release year cannot be in the future."),
	paradigm: z.string().min(2, "Paradigm must be at least 2 characters."),
	popularity: z.coerce
		.number()
		.min(0)
		.max(100, "Popularity must be between 0 and 100."),
});

type FormValues = z.infer<typeof schema>;

export const AddNewLanguagePage: React.FC = () => {
	const navigate = useNavigate();

	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
	});
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
			await addNewLanguage(newLanguage);
			toast({
				title: "Success",
				description: "New programming language added successfully!",
			});
			navigate("/programming-languages", { state: { showToast: true } });
		} catch (err) {
			console.error("Failed to add new language", err);
		}
	};

	return (
		<div className="flex justify-center items-center">
			<Card className="w-full max-w-md">
				<CardHeader className="flex items-start">
					<Button
						onClick={() => navigate("/programming-languages")}
						className="mb-4"
					>
						Back
					</Button>
					<CardTitle className="text-center w-full">
						Add New Programming Language
					</CardTitle>
				</CardHeader>
				<CardContent>
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

							<FormField
								name="releaseYear"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Release Year</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Release Year"
												{...field}
											/>
										</FormControl>
										<FormMessage>{errors.releaseYear?.message}</FormMessage>
									</FormItem>
								)}
							/>

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
												step="0.01"
												placeholder="Popularity (%)"
												{...field}
											/>
										</FormControl>
										<FormMessage>{errors.popularity?.message}</FormMessage>
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Add Language
							</Button>
						</form>
					</FormProvider>
				</CardContent>
			</Card>
		</div>
	);
};
