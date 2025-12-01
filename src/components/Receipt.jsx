import Header from './Header'
import { useLocation, useNavigate } from 'react-router-dom'

const formatPeso = (n) => `₱${Math.round(Number(n || 0)).toLocaleString('en-PH')}`

const Receipt = () => {
  const navigate = useNavigate()
  const { state } = useLocation() || {}

  // Fallback demo data if none passed via router state
  const data = state || {
    orderId: 'ORD-2025-0001',
    date: new Date().toLocaleDateString('en-PH'),
    paymentMethod: 'Cash on Delivery',
    shippingAddress: {
      fullName: 'Pirena',
      line1: '123 Maharlika St',
      city: 'Quezon City',
      postalCode: '1100',
      country: 'Philippines',
      phone: '+63 912 345 6789'
    },
    items: [
      { id: 1, name: 'Purina Pro Plan', qty: 1, price: 2997 },
      { id: 2, name: 'Leather Dog Collar', qty: 1, price: 700 }
    ],
    shippingFee: 80
  }

  const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + (data.shippingFee || 0)

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon and Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-28 h-28 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-amber-900">Payment Successful</h1>
            <p className="text-amber-700 mt-1">Thank you! Here is your receipt.</p>
          </div>

          {/* Receipt Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl font-bold text-amber-900">Receipt</h2>
                <p className="text-sm text-amber-700">{data.date}</p>
              </div>
              <div className="text-sm">
                <span className="text-amber-700">Order ID:</span>
                <span className="ml-2 font-semibold text-amber-900">{data.orderId}</span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-amber-100">
              {data.items.map((item) => (
                <div key={item.id} className="py-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-amber-900">{item.name}</p>
                    <p className="text-sm text-amber-700">Qty: {item.qty}</p>
                  </div>
                  <div className="font-semibold text-amber-900">{formatPeso(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-amber-900">
                <span className="text-sm">Subtotal</span>
                <span className="font-semibold">{formatPeso(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-900">
                <span className="text-sm">Shipping</span>
                <span className="font-semibold">{formatPeso(data.shippingFee || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-900 border-t border-amber-200 pt-3 mt-3">
                <span className="text-base font-bold">Total</span>
                <span className="text-lg font-extrabold">{formatPeso(total)}</span>
              </div>
            </div>

            {/* Payment and Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Payment Method</h3>
                <p className="text-amber-700 text-sm">{data.paymentMethod}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Shipping Address</h3>
                <p className="text-amber-700 text-sm">
                  {data.shippingAddress?.fullName}<br/>
                  {data.shippingAddress?.line1}<br/>
                  {data.shippingAddress?.city} {data.shippingAddress?.postalCode}<br/>
                  {data.shippingAddress?.country}<br/>
                  {data.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-lg border-2 border-amber-300 text-amber-900 font-semibold hover:bg-amber-50 transition-colors duration-200"
              >
                Print Receipt
              </button>
              <button
                onClick={() => navigate('/home', { replace: true })}
                className="px-6 py-3 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Receipt


