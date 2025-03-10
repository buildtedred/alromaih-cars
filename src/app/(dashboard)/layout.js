import "@/app/globals.css";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
