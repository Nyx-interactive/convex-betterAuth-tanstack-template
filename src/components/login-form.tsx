import { FolderTree } from "lucide-react";

import { useState, type ComponentProps, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";

export function LoginForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigateAfterAuth = () => {
    const search = router.state.location.search as
      | { redirect?: unknown }
      | undefined;
    const redirect =
      typeof search?.redirect === "string" && search.redirect.length > 0
        ? search.redirect
        : undefined;

    if (redirect) {
      router.history.push(redirect);
    } else {
      router.navigate({ to: "/" });
    }
  };

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    if (typeof email !== "string" || email.length === 0) {
      setErrorMessage("Email is required.");
      return;
    }

    if (typeof password !== "string" || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (mode === "signUp") {
        await authClient.signUp.email({
          name: typeof name === "string" && name.trim().length > 0 ? name : email,
          email,
          password,
        });
      } else {
        await authClient.signIn.email({
          email,
          password,
        });
      }

      navigateAfterAuth();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleEmailSignIn}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <FolderTree className="size-6" />
              </div>
              <span className="sr-only">Collectr</span>
            </div>
            <h1 className="text-xl font-bold">Welcome to Collectr</h1>
            <FieldDescription>
              {mode === "signIn"
                ? "Sign in to start saving tweet links."
                : "Create your account to start collecting tweets."}
            </FieldDescription>
          </div>
          {mode === "signUp" ? (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" name="name" placeholder="Your name" required />
            </Field>
          ) : null}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </Field>
          {errorMessage ? (
            <FieldDescription className="text-center text-sm text-red-300">
              {errorMessage}
            </FieldDescription>
          ) : null}
          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Working..."
                : mode === "signIn"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </Field>
          <FieldSeparator />
          <FieldDescription className="text-center">
            {mode === "signIn" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-sky-400 transition hover:text-sky-300"
              onClick={() => {
                setMode(mode === "signIn" ? "signUp" : "signIn");
                setErrorMessage(null);
              }}
            >
              {mode === "signIn" ? "Create one" : "Sign in instead"}
            </button>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Collectr is scaffolded for local development. Terms, privacy, and social
        auth setup can be added when the app is productized.
      </FieldDescription>
    </div>
  );
}
