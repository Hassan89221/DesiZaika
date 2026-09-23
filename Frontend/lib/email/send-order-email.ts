interface OrderEmailParams {
  order: {
    id: string
    order_type: 'pickup' | 'delivery'
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_address?: string | null
    notes?: string | null
    total_price: number
    created_at?: string
  }
  items: Array<{
    item_name: string
    quantity: number
    unit_price: number
    line_total: number
  }>
}

export async function sendOrderAlertEmail({ order, items }: OrderEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set. Skipping email alert.')
    return { success: false, error: 'RESEND_API_KEY missing' }
  }

  const recipientEmail = process.env.RESTAURANT_ALERT_EMAIL || 'Unxox11@gmail.com'
  const orderRef = `#${order.id.substring(0, 8).toUpperCase()}`
  const orderTypeLabel = order.order_type === 'delivery' ? '🚗 Delivery Order' : '🏪 Pickup Order'

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">${item.item_name}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #4b5563;">€${item.unit_price.toFixed(2)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #d97706;">€${item.line_total.toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%); padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 10px; }
          .content { padding: 24px; }
          .info-block { background: #f3f4f6; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .info-label { color: #6b7280; font-weight: 500; }
          .info-val { color: #111827; font-weight: 700; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
          .table th { background: #f9fafb; padding: 10px 12px; text-align: left; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 700; border-bottom: 2px solid #e5e7eb; }
          .total-box { background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 16px; margin-top: 20px; text-align: right; }
          .total-price { font-size: 22px; font-weight: 900; color: #c2410c; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
          .btn { display: inline-block; background: #ea580c; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 CurryMama Order Alert</h1>
            <p>New customer order received!</p>
            <div class="badge">${orderTypeLabel}</div>
          </div>

          <div class="content">
            <div class="info-block">
              <div class="info-row">
                <span class="info-label">Order Reference:</span>
                <span class="info-val">${orderRef}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Customer Name:</span>
                <span class="info-val">${order.customer_name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone Number:</span>
                <span class="info-val">${order.customer_phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-val">${order.customer_email}</span>
              </div>
              ${
                order.customer_address
                  ? `<div class="info-row"><span class="info-label">Delivery Address:</span><span class="info-val">${order.customer_address}</span></div>`
                  : ''
              }
              ${
                order.notes
                  ? `<div class="info-row" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #d1d5db;"><span class="info-label">Notes &amp; Payment:</span><span class="info-val" style="color: #c2410c;">${order.notes}</span></div>`
                  : ''
              }
            </div>

            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #111827;">Ordered Items</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-box">
              <span style="font-size: 14px; color: #4b5563;">Total Bill: </span>
              <span class="total-price">€${Number(order.total_price).toFixed(2)}</span>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:3000/admin" class="btn">Open Admin Dashboard →</a>
            </div>
          </div>

          <div class="footer">
            CurryMama Restaurant • 30 Crumlin Rd, Dublin, D12 HXW0 • (01) 538 1281
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'CurryMama Orders <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `🚨 NEW ORDER ${orderRef} — €${Number(order.total_price).toFixed(2)} (${order.customer_name})`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return { success: false, error: data.message || 'Resend API failed' }
    }

    console.log('Resend email alert dispatched successfully:', data)
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to send Resend order alert email:', err)
    return { success: false, error: err.message }
  }
}
