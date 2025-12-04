import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderId } = req.body

    // Validate orderId
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' })
    }

    console.log('🔍 Fetching order:', orderId)

    // Fetch order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError)
      return res.status(404).json({ error: 'Order not found' })
    }

    console.log('✅ Order found:', order.order_number)

    // Check if payment intent already exists
    if (order.stripe_payment_intent_id) {
      console.log('♻️ Retrieving existing payment intent')
      
      const existingIntent = await stripe.paymentIntents.retrieve(
        order.stripe_payment_intent_id
      )

      return res.status(200).json({
        clientSecret: existingIntent.client_secret,
        paymentIntentId: existingIntent.id
      })
    }

    // Create new payment intent
    const amountInCentavos = Math.round(order.total_amount * 100)

    console.log('💳 Creating payment intent:', {
      amount: amountInCentavos,
      currency: order.currency || 'php'
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCentavos,
      currency: order.currency?.toLowerCase() || 'php',
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
        userId: order.user_id
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    // Save payment intent ID to order
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', orderId)

    if (updateError) {
      console.warn('⚠️ Failed to save payment intent ID:', updateError)
    }

    // Return client secret
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('❌ Payment intent error:', error)
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message 
    })
  }
}