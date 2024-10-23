import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
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
import type { Database } from "../types/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { user } = useAuth() as { user: User | null };
  const [userData, setUserData] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user]);

  async function fetchUserData(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUserData(data);
      form.reset({
        username: data.username || "",
        email: data.email || "",
        avatar_url: data.avatar_url || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: values.username,
          email: values.email,
          avatar_url: values.avatar_url,
        })
        .eq("id", user?.id || "");

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Update Profile</h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a URL for your avatar image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </Form>
    </div>
  );
}
