// api/create-payment-intent.js
// Place this file in: /api/create-payment-intent.js

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

    // Convert amount to centavos (Stripe requires smallest currency unit)
    const amountInCentavos = Math.round(order.total_amount * 100)

    console.log('💳 Creating payment intent for:', amountInCentavos, 'centavos')

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCentavos,
      currency: 'php',
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
      },
      description: `Payment for Order ${order.order_number}`,
    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    // Update order with payment intent ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', orderId)

    if (updateError) {
      console.error('⚠️ Failed to update order with payment intent:', updateError)
    }

    // Create payment transaction record
    const { error: txError } = await supabase
      .from('payment_transactions')
      .insert([{
        order_id: orderId,
        transaction_id: paymentIntent.id,
        payment_method: 'stripe',
        amount: order.total_amount,
        currency: 'PHP',
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      }])

    if (txError) {
      console.error('⚠️ Failed to create payment transaction:', txError)
    }

    // Return client secret to frontend
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    })

  } catch (error) {
    console.error('❌ Error creating payment intent:', error)
    return res.status(500).json({
      error: error.message || 'Failed to create payment intent',
    })
  }
}