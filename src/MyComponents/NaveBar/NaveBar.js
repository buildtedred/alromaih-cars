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
    </nav>
  );
}

export default Navebar;
