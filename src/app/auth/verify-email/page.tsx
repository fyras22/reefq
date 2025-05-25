import { redirect } from "next/navigation";

export default function VerifyEmailRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/auth/verify-email");
}
