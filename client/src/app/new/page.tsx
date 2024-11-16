"use client";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";
import { FormEvent, ChangeEventHandler } from "react";


import { cn } from "@/lib/utils";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const species = [
	{ value: "Fallow deer", label: "Fallow deer" },
	{ value: "Red deer", label: "Red deer" },
	{ value: "Roe deer", label: "Roe deer" },
	{ value: "Wild boar", label: "Wild boar" },
	{ value: "Schottish Highlander", label: "Schottish Highlander" },
	{ value: "Wolf", label: "Wolf" },
];

const genders = ["Male", "Female", "Unknown"];

const ages = ["Young", "Adult", "Mature", "Unknown"];

export const fileToDataString = (file: File) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onerror = (error) => reject(error);
		reader.onload = () => resolve(reader.result as string);
	});
};

const headers: HeadersInit = {
	"Content-Type": `multipart/form-data;`,
	Accept: "multipart/form-data",
};

export const axiosInstance = axios.create({
	baseURL: "https://localhost:8000",
	headers,
});

export const formSchema = z.object({
	animal: z
		.enum([
			"Fallow deer",
			"Red deer",
			"Roe deer",
			"Wild boar",
			"Schottish Highlander",
			"Wolf",
		])
		.optional(),
	number: z.coerce.number().min(1),
	gender: z.enum(["Male", "Female", "Unknown"]),
	age: z.enum(["Young", "Adult", "Mature", "Unknown"]),
	health: z.coerce.number().min(1).max(5),
	user: z.string().optional(),
	location: z.array(z.number()).optional(),
	datetime: z.date().optional(),
	remarks: z.string(),
});

export default function LoginForm() {
	// const [isSubmiting, setIsSubmiting] = useState(false);
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");

	const [selectedImage, setSelectedImage] = useState<File>();
	const [previewImgUrl, setPreviewimgUrl] = useState("");
	const [progress, setProgress] = useState<number>(0);

	const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		const file = event.target.files as FileList;
		setSelectedImage(file?.[0]);
		if (!file) {
			return;
		}
		try {
			const imgUrl = await fileToDataString(file?.[0]);
			setPreviewimgUrl(imgUrl);
		} catch (error) {
			console.log(error);
		}
	};

	const handleImageUpload = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			if (selectedImage) {
				formData.append("file", selectedImage);
				const response = await axiosInstance.post(`/upload/file`, formData, {
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							progressEvent.total ? (100 * progressEvent.loaded) / progressEvent.total : 0
						);
						setProgress(progress);
					},
				});
				setProgress(0);
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			number: 1,
		},
	});

	async function getLocation(): Promise<[number, number]> {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("Geolocation is not supported"));
			}


			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log(position)
					resolve([
						position.coords.latitude,
						position.coords.longitude,
					]);
				},
				(error) => {
					reject(error);
				}
			);
		});
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const authToken = localStorage.getItem("authToken");

		if (!authToken) {
			//ERROR
			// return;
		}

		values.user = authToken;
		values.location = await getLocation();
		values.datetime = date;

		if (!value || value === '') {
			return;
		}

		values.animal = value as "Fallow deer" | "Red deer" | "Roe deer" | "Wild boar" | "Schottish Highlander" | "Wolf";

		console.log(values);

		const response = await fetch(
			`{process.env.NEXT_PUBLIC_API_URL}/api/login`,
			{
				method: "POST",
				body: JSON.stringify(values),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			// ERROR CASE
		}

		const sessionToken = (await response.json()).authorization;

		localStorage.setItem("sessionToken", sessionToken);
	}

	return (
		<main className="w-full md:w-[80%] m-auto min-h-[100vh] flex justify-center pt-5">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-2 h-min my-auto"
				>
					{/* Species Selector */}
					<FormField
						control={form.control}
						name="animal"
						render={({ field }) => (
							<FormItem className="flex flex-col" {...field}>
								<FormLabel>Species</FormLabel>
								<FormControl>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												className="w-[200px] justify-between"
											>
												{value
													? species.find(
														(selection) =>
															selection.value ===
															value
													)?.label
													: "Select Species"}
												<ChevronsUpDown className="opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search framework..." />
												<CommandList>
													<CommandEmpty>
														No species found.
													</CommandEmpty>
													<CommandGroup>
														{species.map(
															(selection) => (
																<CommandItem
																	key={
																		selection.value
																	}
																	value={
																		selection.value
																	}
																	onSelect={(
																		currentValue
																	) => {
																		setValue(
																			currentValue ===
																				value
																				? ""
																				: currentValue
																		);
																		setOpen(
																			false
																		);
																	}}
																>
																	{
																		selection.label
																	}
																	<Check
																		className={cn(
																			"ml-auto",
																			value ===
																				selection.value
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																</CommandItem>
															)
														)}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormDescription>
									What animal do you see?
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Count Input */}
					<FormField
						control={form.control}
						name="number"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Count</FormLabel>
								<FormControl>
									<Input type="number" {...field}></Input>
								</FormControl>
								<FormDescription>
									How many animals do you see?
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Gender Selector */}
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select Gender" />
										</SelectTrigger>
										<SelectContent>
											{genders.map((gender) => {
												return (
													<SelectItem
														value={gender}
														key={gender}
													>
														{gender}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Age Selector */}
					<FormField
						control={form.control}
						name="age"
						render={({ field }) => (
							<FormItem className="flex flex-col" {...field}>
								<FormLabel>Age</FormLabel>
								<FormControl>
									<Select>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select Age" />
										</SelectTrigger>
										<SelectContent>
											{ages.map((age) => {
												return (
													// eslint-disable-next-line react/jsx-key
													<SelectItem
														value={age}
														key={age}
													>
														{age}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Health Selector */}
					<FormField
						control={form.control}
						name="health"
						render={({ field }) => (
							<FormItem className="flex flex-col" {...field}>
								<FormLabel>Health</FormLabel>
								<FormControl>
									<Select>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select Health" />
										</SelectTrigger>
										<SelectContent>
											{["5", "4", "3", "2", "1"].map(
												(health) => {
													return (
														// eslint-disable-next-line react/jsx-key
														<SelectItem
															value={health}
															key={health}
														>
															{health}
														</SelectItem>
													);
												}
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Datetime Input */}
					<FormField
						control={form.control}
						name="datetime"
						render={({ field }) => (
							<FormItem className="flex flex-col" {...field}>
								<FormLabel>Date and Time</FormLabel>
								<FormControl>
									<DateTimePicker
										value={date}
										onChange={setDate}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Image Upload */}
					<div className="col-span-full">
						{selectedImage && progress > 0 && (
							<div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
								<div 
									className="bg-blue-600 h-2.5 rounded-full" 
									style={{ width: `${progress}%` }}
								/>
							</div>
						)}
						{previewImgUrl && (
							<div className="mt-2 mb-4">
								<img 
									src={previewImgUrl} 
									alt="Preview" 
									className="max-w-[300px] rounded-lg"
								/>
							</div>
						)}

						<form onSubmit={handleImageUpload} className="space-y-4">
							<Input 
								type="file" 
								onChange={handleFileChange} 
								accept="image/*"
								className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
							/>
							<Button 
								type="submit" 
								disabled={!selectedImage}
								className="w-full"
							>
								Upload image
							</Button>
						</form>
					</div>

					{/* Remarks */}
					<FormField
						control={form.control}
						name="remarks"
						render={({ field }) => (
							<FormItem
								className="flex flex-col col-span-full"
								{...field}
							>
								<FormLabel>Additional Remarks</FormLabel>
								<FormControl>
									<Textarea></Textarea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full col-span-full">
						Submit
					</Button>
				</form>
			</Form>
		</main>
	);
}
