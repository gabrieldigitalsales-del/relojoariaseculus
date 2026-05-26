export function calculateCart(items, coupon, shippingBase = 29.9) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * (item.salePrice || item.price), 0)
  let discount = 0
  let shipping = subtotal > 900 ? 0 : shippingBase
  if (coupon?.active) {
    if (coupon.type === 'percent') discount = subtotal * (Number(coupon.value) / 100)
    if (coupon.type === 'fixed') discount = Number(coupon.value)
    if (coupon.type === 'shipping') shipping = 0
  }
  const total = Math.max(subtotal - discount, 0) + shipping
  return { subtotal, discount, shipping, total }
}

export function buildWhatsAppOrder({ cart, coupon, customer, totals, store }) {
  const lines = cart.map((item) => `• ${item.quantity}x ${item.name} - R$ ${((item.salePrice || item.price) * item.quantity).toFixed(2)}`).join('\n')
  const message = `Olá, gostaria de finalizar meu pedido na ${store.settings.storeName}.\n\n${lines}\n\nSubtotal: R$ ${totals.subtotal.toFixed(2)}\nDesconto: R$ ${totals.discount.toFixed(2)}\nFrete: ${totals.shipping === 0 ? 'Grátis' : `R$ ${totals.shipping.toFixed(2)}`}\nTotal: R$ ${totals.total.toFixed(2)}\nCupom: ${coupon?.code || 'Não aplicado'}\n\nNome: ${customer.name || ''}\nTelefone: ${customer.phone || ''}\nCEP: ${customer.cep || ''}\nEndereço: ${customer.address || ''}\nPagamento: ${customer.payment || ''}\nObservações: ${customer.notes || ''}`
  return `https://wa.me/${store.settings.whatsapp}?text=${encodeURIComponent(message)}`
}

export async function createPaymentSession() {
  return { provider: 'future', status: 'pending_integration' }
}
