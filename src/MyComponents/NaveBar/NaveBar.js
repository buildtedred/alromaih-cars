<<<<<<< HEAD
import navigationBar from "@/All-routes/All-routes";
import Link from "next/link";


function Navebar() {
  return (
    <nav className="bg-gray-800 shadow-lg ">
      <ul className="flex justify-center space-x-6 p-4">
        {navigationBar.items.map((item, index) => (
          <li key={index} className="text-white font-medium">
            <Link
              href={item.link}
              className="hover:text-blue-400 transition duration-300"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
=======
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
>>>>>>> a659c508498994a848ebd61c944a1cee07b2061e
    </nav>
  );
}

<<<<<<< HEAD
export default Navebar;
=======
export default Navbar;
>>>>>>> a659c508498994a848ebd61c944a1cee07b2061e
