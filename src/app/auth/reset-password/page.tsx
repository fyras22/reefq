import { redirect } from "next/navigation";

export default function ResetPasswordRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/auth/reset-password");
}
