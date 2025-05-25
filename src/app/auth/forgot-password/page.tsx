import { redirect } from "next/navigation";

export default function ForgotPasswordRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/auth/forgot-password");
}
