import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/auth/login");
}
