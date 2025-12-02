const PaymentManagement = ({ payments }) => {
  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        Payment Management
      </h2>
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
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-amber-100 last:border-0 hover:bg-amber-50 transition-colors">
                <td className="py-4 px-4 text-amber-700 font-medium">{payment.transactionId}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">{payment.customerName}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">₱{Math.round(payment.amount)}</td>
                <td className="py-4 px-4 text-amber-700 font-medium">{payment.paymentMethod}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-amber-700 font-medium">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentManagement