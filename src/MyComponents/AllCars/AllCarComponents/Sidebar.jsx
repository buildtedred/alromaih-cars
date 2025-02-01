export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-80 bg-white shadow-lg overflow-y-auto z-40 p-4">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Make</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> Toyota
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> Honda
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> Ford
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Year</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> 2023
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> 2022
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" /> 2021
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}

