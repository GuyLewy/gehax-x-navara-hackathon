"use client";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
