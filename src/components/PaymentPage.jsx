import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Header from './Header'

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Payment Form Component
const CheckoutForm = ({ orderId, orderNumber }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success/${orderId}`,
        },
        redirect: 'if_required'
      })

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!')
        
        // Update order status
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'confirmed',
            paid_at: new Date().toISOString()
          })
          .eq('id', orderId)

        // Redirect to success page
        navigate(`/payment-success/${orderId}`)
      }

    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
        <PaymentElement />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-amber-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay Now
          </>
        )}
      </button>

      {/* Security Info */}
      <p className="text-xs text-center text-amber-600">
        🔒 Your payment is secured by Stripe
      </p>
    </form>
  )
}

// Main Payment Page Component
const PaymentPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [clientSecret, setClientSecret] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadOrderAndCreatePaymentIntent()
  }, [orderId, isAuthenticated])

  const loadOrderAndCreatePaymentIntent = async () => {
    try {
      console.log('📦 Loading order:', orderId)

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (orderError || !orderData) {
        throw new Error('Order not found')
      }

      setOrder(orderData)
      console.log('✅ Order loaded:', orderData.order_number)

      // Create payment intent
      console.log('💳 Creating payment intent...')
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      console.log('✅ Payment intent created')
      setClientSecret(data.clientSecret)

    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed to load payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-900 font-semibold">Loading payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Payment Error</h2>
            <p className="text-amber-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/cart')}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors duration-200"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#92400e',
        colorBackground: '#fffbeb',
        colorText: '#78350f',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Checkout
          </button>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Complete Payment
            </h1>
            <p className="text-amber-700">
              Order #{order?.order_number}
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Order Summary */}
            <div className="mb-6 pb-6 border-b border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-amber-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₱{Math.round(order?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">₱{Math.round(order?.shipping_fee || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-amber-900 pt-2 border-t border-amber-200">
                  <span>Total</span>
                  <span>₱{Math.round(order?.total_amount || 0)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            {clientSecret && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm 
                  orderId={orderId} 
                  orderNumber={order?.order_number}
                />
              </Elements>
            )}
          </div>

          {/* Security Badges */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-amber-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PCI Compliant
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentPage