import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export const fileToDataString = (file: File): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onerror = (error) => reject(error);
		reader.onload = () => resolve(reader.result as string);
	});
};