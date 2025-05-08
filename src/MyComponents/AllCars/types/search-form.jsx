import { Search } from 'lucide-react'

export function SearchForm() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-[#71308A]"
      />
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  )
}
