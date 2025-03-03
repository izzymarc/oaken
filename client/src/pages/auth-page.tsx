import { useState } from 'react'; // Added useState import
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Redirect } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
  });

  const signIn = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError("");
    try {
      await fetch("/.netlify/functions/login", { // Updated API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      loginMutation.mutate(data); // Still call mutation for local state update
    } catch (error: any) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: z.infer<typeof insertUserSchema>) => {
    setLoading(true);
    setError("");
    try {
      await fetch("/.netlify/functions/register", { // Updated API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      registerMutation.mutate(data); // Still call mutation for local state update
    } catch (error: any) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(signIn)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading || loginMutation.isPending}>
                      Login
                    </Button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(register)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vendor">Event Professional</SelectItem>
                              <SelectItem value="client">Event Planner</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading || registerMutation.isPending}>
                      Register
                    </Button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block flex-1 bg-slate-50 p-8">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-4xl font-bold">Welcome to EventWork</h1>
          <p className="text-lg text-gray-600">
            Connect with talented event professionals or find your next event opportunity.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
              alt="Event Venue"
              className="rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a"
              alt="Event"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
