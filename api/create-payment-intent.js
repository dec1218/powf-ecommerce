// /api/create-payment-intent.js
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🚀 Function started')
    console.log('📦 Request body:', req.body)

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY not found')
      return res.status(500).json({ error: 'Stripe secret key not configured' })
    }

    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase credentials not found')
      return res.status(500).json({ error: 'Supabase credentials not configured' })
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    console.log('✅ Stripe initialized')

    // Initialize Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )
    console.log('✅ Supabase initialized')

    const { orderId } = req.body

    // Validate orderId
    if (!orderId) {
      console.error('❌ No orderId provided')
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
      
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(
          order.stripe_payment_intent_id
        )

        return res.status(200).json({
          clientSecret: existingIntent.client_secret,
          paymentIntentId: existingIntent.id
        })
      } catch (stripeError) {
        console.warn('⚠️ Existing payment intent not found, creating new one')
      }
    }

    // Create new payment intent
    const amountInCentavos = Math.round(order.total_amount * 100)

    console.log('💳 Creating payment intent:', {
      amount: amountInCentavos,
      currency: order.currency || 'php'
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCentavos,
      currency: (order.currency || 'php').toLowerCase(),
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
    console.error('❌ Function error:', error)
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}