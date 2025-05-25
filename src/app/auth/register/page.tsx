import { redirect } from "next/navigation";

export default function RegisterRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/auth/register");
}
