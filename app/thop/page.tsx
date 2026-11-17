import { redirect } from "next/navigation";

/** THOP is the homepage. Keep the old address pointing there. */
export default function ThopRedirect() {
  redirect("/");
}
