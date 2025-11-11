"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation } from "@urql/next";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { loginSchema } from "../schemas";
import {
  ANONYMOUS_SIGNIN_MUTATION,
  SING_IN_MUTATION
} from "../graphql/mutations";
/* import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth"; */

export const SignInCard = () => {
  const router = useRouter();
  const [{ fetching }, signIn] = useMutation(SING_IN_MUTATION);
  const [{ fetching: fetchingGuest }, signInAsGuest] = useMutation(
    ANONYMOUS_SIGNIN_MUTATION
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    signIn({
      input: {
        email: values.email,
        password: values.password
      }
    }).then((result) => {
      if (result.error) {
        toast.error("Sign-in failed");
        form.setError("email", {
          type: "manual",
          message: "Invalid email or password"
        });
        form.setError("password", {
          type: "manual",
          message: "Invalid email or password"
        });
      } else {
        toast.success("Signed in successfully");
        router.refresh();
      }
    });
  };

  const onGuestSignIn = () => {
    signInAsGuest().then((result) => {
      if (result.error) {
        toast.error("Guest sign-in failed");
      } else {
        toast.success("Signed in as Guest");
        router.refresh();
      }
    });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col items-center mb-4 gap-y-2">
        <FaUser className="mr-2 size-5" />
        <Button
          onClick={onGuestSignIn}
          disabled={fetchingGuest}
          variant="outline"
          size="lg"
          className="w-full"
        >
          Continue as Guest
        </Button>
      </CardContent>
      <CardContent className="px-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={fetching} size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          onClick={() => {}}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button
          onClick={() => {}}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Login with GitHub
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?
          <Link href="/sign-up">
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
