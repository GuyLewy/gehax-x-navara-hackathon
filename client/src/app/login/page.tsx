"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useState } from "react";

const formSchema = z.object({
	username: z.string().min(1, {
		message: "Username is required",
	}),
	password: z.string().min(1, {
		message: "password is required",
	}),
});

export default function LoginForm() {
	// const [isSubmiting, setIsSubmiting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: "",
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch(`{process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!response.ok) {
            // ERROR CASE
        }

        const sessionToken = (await response.json()).authorization

        localStorage.setItem("sessionToken", sessionToken)
    }

	return (
		<main className="w-1/2 m-auto flex flex-col items-center justify-center min-h-[100vh]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The password to your account.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Submit</Button>
                </form>
            </Form>
        </main>
	);
}
