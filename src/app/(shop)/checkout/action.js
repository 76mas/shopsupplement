'use server';

import prisma from '@/lib/prisma';

// ── التحقق من رقم الهاتف العراقي ──────────────────────────
function isValidIraqiPhone(phone) {
  // يقبل: 07XXXXXXXX أو +9647XXXXXXXX أو 009647XXXXXXXX
  return /^(\+964|00964|0)7[3-9]\d{8}$/.test(phone.replace(/\s/g, ''));
}

// ── تطبيع الرقم إلى صيغة 07XXXXXXXX ──────────────────────
function normalizePhone(phone) {
  const clean = phone.replace(/\s/g, '');
  if (clean.startsWith('+964')) return '0' + clean.slice(4);
  if (clean.startsWith('00964')) return '0' + clean.slice(5);
  return clean;
}

// ─────────────────────────────────────────────────────────────
//  CREATE ORDER  — يُستدعى عند اختيار "عبر المتجر"
// ─────────────────────────────────────────────────────────────
export async function createOrder({ name, phoneNumber, address, items, deliveryPrice }) {
  // ── التحقق من البيانات ─────────────────────────────────
  if (!name?.trim())        return { success: false, message: 'يرجى إدخال الاسم الكامل' };
  if (!address?.trim())     return { success: false, message: 'يرجى إدخال العنوان' };
  if (!phoneNumber?.trim()) return { success: false, message: 'يرجى إدخال رقم الهاتف' };
  if (!isValidIraqiPhone(phoneNumber))
    return { success: false, message: 'رقم الهاتف غير صحيح (مثال: 07XXXXXXXX)' };
  if (!items?.length)       return { success: false, message: 'سلة الشراء فارغة' };

  const phone = normalizePhone(phoneNumber);

  try {
    // ── جلب المنتجات للتحقق من التوفر والسعر ────────────
    const productIds = [...new Set(items.map((i) => Number(i.id)))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, deleteAt: null },
      select: { id: true, name: true, endPrice: true, isAvailable: true, stock: true },
    });

    const productMap = Object.fromEntries(dbProducts.map((p) => [p.id, p]));

    for (const item of items) {
      const p = productMap[Number(item.id)];
      if (!p)              return { success: false, message: `المنتج "${item.name}" غير موجود` };
      if (!p.isAvailable)  return { success: false, message: `المنتج "${item.name}" غير متوفر حالياً` };
    }

    // ── حساب الإجمالي من أسعار DB (لا نثق بأسعار الـ client) ──
    const subtotal = items.reduce((acc, item) => {
      const price = Number(productMap[Number(item.id)]?.endPrice ?? item.price);
      return acc + price * item.quantity;
    }, 0);
    const shipping = Number(deliveryPrice ?? 5000);
    const totalPrice = subtotal + shipping;

    // ── إنشاء الطلب في قاعدة البيانات ──────────────────
    const order = await prisma.order.create({
      data: {
        name: name.trim(),
        phoneNumber: phone,
        address: address.trim(),
        totalPrice,
        items: {
          create: items.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
            price: Number(productMap[Number(item.id)]?.endPrice ?? item.price),
          })),
        },
      },
      include: { items: true },
    });

    return {
      success: true,
      message: 'تم إنشاء طلبك بنجاح! سنتواصل معك قريباً.',
      orderId: order.id,
    };
  } catch (error) {
    console.error('[createOrder]', error);
    return { success: false, message: 'حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مجدداً' };
  }
}

// ─────────────────────────────────────────────────────────────
//  BUILD WHATSAPP MESSAGE
// ─────────────────────────────────────────────────────────────
export async function buildWhatsAppUrl({ name, phoneNumber, address, items, deliveryPrice }) {
  // ── التحقق ──────────────────────────────────────────────
  if (!name?.trim())        return { success: false, message: 'يرجى إدخال الاسم الكامل' };
  if (!address?.trim())     return { success: false, message: 'يرجى إدخال العنوان' };
  if (!phoneNumber?.trim()) return { success: false, message: 'يرجى إدخال رقم الهاتف' };
  if (!isValidIraqiPhone(phoneNumber))
    return { success: false, message: 'رقم الهاتف غير صحيح (مثال: 07XXXXXXXX)' };
  if (!items?.length)       return { success: false, message: 'سلة الشراء فارغة' };

  const phone = normalizePhone(phoneNumber);

  // ── بناء نص الرسالة ────────────────────────────────────
  const itemsText = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name}` +
        (item.flavor ? ` — النكهة: ${item.flavor}` : '') +
        (item.size   ? ` — الحجم: ${item.size}`    : '') +
        ` × ${item.quantity} = ${(Number(item.price) * item.quantity).toLocaleString()} د.ع`
    )
    .join('\n');

  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const shipping  = Number(deliveryPrice ?? 5000);
  const total     = subtotal + shipping;

  const message = [
    '🛒 *طلب جديد من المتجر*',
    '',
    `👤 الاسم: ${name.trim()}`,
    `📞 رقم الهاتف: ${phone}`,
    `📍 العنوان: ${address.trim()}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    '🧾 *تفاصيل الطلب:*',
    itemsText,
    '━━━━━━━━━━━━━━━━━━━━',
    `💰 المجموع الفرعي: ${subtotal.toLocaleString()} د.ع`,
    `🚚 سعر التوصيل: ${shipping.toLocaleString()} د.ع`,
    `✅ *الإجمالي: ${total.toLocaleString()} د.ع*`,
  ].join('\n');

  // رقم واتساب المتجر: 07727488537 → 9647727488537
  const storeWhatsApp = '9647727488537';
  const url = `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(message)}`;

  return { success: true, url };
}

// ─────────────────────────────────────────────────────────────
//  GET SHOP DELIVERY PRICE (اختياري — من ShopInfo)
// ─────────────────────────────────────────────────────────────
export async function getDeliveryPrice() {
  try {
    const info = await prisma.shopInfo.findFirst();
    return { success: true, price: Number(info?.deliveryPrice ?? 5000) };
  } catch {
    return { success: true, price: 5000 };
  }
}
