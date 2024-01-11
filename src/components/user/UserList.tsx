const UserList = () => {
  return (
    <div className="flex w-full justify-center p-4">
<div className="relative overflow-x-auto shadow-md sm:rounded-lg w-11/12">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="p-4">
                    <div className="flex items-center">
                        <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  "/>
                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    Product name
                </th>
                <th scope="col" className="px-6 py-3">
                    Color
                </th>
                <th scope="col" className="px-6 py-3">
                    Category
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id="checkbox-table-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                    </div>
                </td>
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                    <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image"/>
                    <div className="ps-3">
                        <div className="text-base font-semibold">Neil Sims</div>
                        <div className="font-normal text-gray-500">neil.sims@flowbite.com</div>
                    </div>  
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</div>

  )
}

export default UserList