const ProductManagement = ({ products, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">
          Product Management
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-amber-200">
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Name</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Price</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Stock</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                    <span className="font-medium text-amber-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-amber-700 font-medium">₱{Math.round(product.price)}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">
                  {product.stock}
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement