const OrderManagement = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        Order Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-amber-200">
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Order ID</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Customer Name</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Date</th>
              <th className="text-left py-4 px-4 text-amber-900 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                <td className="py-4 px-4 text-amber-700 font-medium">{order.id}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">{order.customerName}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">{order.date}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderManagement