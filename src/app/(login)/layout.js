import "@/app/globals.css"


export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full h-screen flex">
 
            <main className="w-full flex-1 overflow-auto p-6">{children}</main>
    
      </body>
    </html>
  )
}

