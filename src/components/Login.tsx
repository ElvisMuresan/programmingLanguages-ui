import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react"; // Pentru gestionarea erorilor sau stării de autentificare
import { loginUser } from "./api/languages-api"; // Importă funcția de login

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

// Schema de validare cu zod
const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export function Login() {
  const [error, setError] = useState<string | null>(null); // Starea pentru erori de login
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Functia care se apeleaza la submit-ul formularului
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // Apelează funcția loginUser din API
      const response = await loginUser(values.username, values.password);

      // Dacă login-ul reușește, stochează token-ul JWT
      localStorage.setItem("token", response.user.token);

      // Șterge mesajul de eroare, dacă există
      setError(null);

      // Poți face o redirecționare sau altă acțiune aici după login
      console.log("Login successful!", response);
    } catch (error) {
      // Dacă apare o eroare, afișează mesajul de eroare
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-card">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
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
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500">{error}</p>} {/* Mesaj de eroare */}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
