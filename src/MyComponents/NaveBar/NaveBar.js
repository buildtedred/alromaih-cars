import Link from "next/link";
import { navigationBar } from "@/All-routes/All-routes";

function Navbar() {
  return (
    <nav className="bg-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand Name */}
          <div className="text-white text-2xl font-extrabold tracking-wide">
            <Link href="/">
              <span className="hover:text-purple-300 transition duration-300">
                Alromaih Cars
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6">
            {navigationBar.items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className="text-white font-medium hover:text-purple-300 transition duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
