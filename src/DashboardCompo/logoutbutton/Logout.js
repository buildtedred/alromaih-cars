"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout Failed:", error.message);
      } else {
        // Ensure session is cleared from local storage
        localStorage.removeItem("sb-<project-id>-auth-token");

        router.refresh(); // Refresh the UI
        router.push("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Unexpected Logout Error:", err);
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}
