const PaymentManagement = ({ payments, onUpdatePaymentStatus }) => {
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'refunded':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handlePaymentStatusChange = (paymentId, currentStatus) => {
    const statuses = ['pending', 'paid', 'failed', 'refunded']
    
    const message = `Update payment status from "${currentStatus}" to:\n\n${statuses.map((s, i) => `${i + 1}. ${s.toUpperCase()}`).join('\n')}\n\nEnter number (1-${statuses.length}):`
    
    const choice = prompt(message)
    
    if (choice && !isNaN(choice)) {
      const index = parseInt(choice) - 1
      if (index >= 0 && index < statuses.length) {
        const newStatus = statuses[index]
        if (newStatus !== currentStatus) {
          onUpdatePaymentStatus(paymentId, newStatus)
        }
      } else {
        alert('Invalid choice!')
      }
    }
  }

  // Calculate totals
  const totalRevenue = payments
    .filter(p => p.status?.toLowerCase() === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const pendingAmount = payments
    .filter(p => p.status?.toLowerCase() === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-amber-900">
          Payment Management
        </h2>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 font-medium">Total Revenue</div>
            <div className="text-lg font-bold text-green-700">₱{Math.round(totalRevenue)}</div>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-600 font-medium">Pending</div>
            <div className="text-lg font-bold text-yellow-700">₱{Math.round(pendingAmount)}</div>
          </div>
        </div>
      </div>
      
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-amber-600 text-lg">No payments yet</p>
          <p className="text-amber-500 text-sm mt-2">Payment transactions will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-amber-200">
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Transaction ID</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Customer</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Amount</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Payment Method</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Status</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Date</th>
                <th className="text-left py-4 px-4 text-amber-900 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                  <td className="py-4 px-4 text-amber-700 font-medium text-sm">
                    {payment.transactionId}
                  </td>
                  <td className="py-4 px-4 text-amber-700 font-medium">
                    {payment.customerName}
                  </td>
                  <td className="py-4 px-4 text-amber-700 font-bold">
                    ₱{Math.round(payment.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {payment.paymentMethod}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(payment.status)}`}
                    >
                      {payment.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-amber-700 font-medium text-sm">
                    {payment.date}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handlePaymentStatusChange(payment.id, payment.status)}
                      className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement