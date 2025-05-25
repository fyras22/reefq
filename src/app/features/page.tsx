import { redirect } from "next/navigation";

export default function FeaturesRedirectPage() {
  // Redirect to the English version by default
  redirect("/en/features");
}
