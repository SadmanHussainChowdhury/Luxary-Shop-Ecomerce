import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'

export async function POST(_req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectToDatabase()

  await Product.deleteMany({})
  await Product.insertMany([
    {
      title: 'Premium Leather Backpack',
      slug: 'premium-leather-backpack',
      description: 'Handcrafted full-grain leather backpack with timeless design.',
      price: 279,
      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Bags',
      brand: 'Ultra',
      countInStock: 25,
      rating: 4.7,
      numReviews: 142,
      isFeatured: true,
      tags: ['premium', 'leather']
    },
    {
      title: 'Modern Ceramic Vase',
      slug: 'modern-ceramic-vase',
      description: 'Minimalist matte ceramic vase for premium interiors.',
      price: 89,
      images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Home',
      brand: 'Artisan',
      countInStock: 80,
      rating: 4.5,
      numReviews: 58,
      isFeatured: true,
      tags: ['premium', 'home']
    },
    {
      title: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      description: 'Studio-grade ANC with 40h battery life and ultra comfort.',
      price: 349,
      images: [{ url: 'https://images.unsplash.com/photo-1518443952244-9d3a9713fbb3?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Audio',
      brand: 'SonicX',
      countInStock: 60,
      rating: 4.8,
      numReviews: 321,
      isFeatured: true,
      tags: ['premium', 'audio']
    },
    {
      title: 'Signature Cotton Tee',
      slug: 'signature-cotton-tee',
      description: 'Ultra-soft 240gsm heavyweight cotton tee with perfect drape.',
      price: 49,
      images: [{ url: 'https://images.unsplash.com/photo-1520975922284-9dffa7aef67b?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Apparel',
      brand: 'Ultra',
      countInStock: 200,
      rating: 4.6,
      numReviews: 89,
      tags: ['apparel']
    },
    {
      title: 'Marble Desk Tray',
      slug: 'marble-desk-tray',
      description: 'Carrara marble desk organizer for a refined workspace.',
      price: 119,
      images: [{ url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Desk',
      brand: 'Stonework',
      countInStock: 40,
      rating: 4.4,
      numReviews: 33,
      tags: ['desk', 'home']
    },
    {
      title: 'Scented Soy Candle',
      slug: 'scented-soy-candle',
      description: 'Hand-poured soy candle with notes of cedar and bergamot.',
      price: 39,
      images: [{ url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Home',
      brand: 'Noir',
      countInStock: 120,
      rating: 4.3,
      numReviews: 61,
      tags: ['home']
    },
    {
      title: 'Herringbone Wool Coat',
      slug: 'herringbone-wool-coat',
      description: 'Tailored wool coat with premium horn buttons.',
      price: 499,
      images: [{ url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Apparel',
      brand: 'Maison',
      countInStock: 15,
      rating: 4.9,
      numReviews: 41,
      isFeatured: true,
      tags: ['premium', 'apparel']
    },
    {
      title: 'Oak Standing Desk',
      slug: 'oak-standing-desk',
      description: 'Solid oak height-adjustable desk with cable management.',
      price: 1299,
      images: [{ url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Desk',
      brand: 'Nordic',
      countInStock: 8,
      rating: 4.7,
      numReviews: 24,
      tags: ['premium', 'desk']
    },
    {
      title: 'Italian Leather Weekender',
      slug: 'italian-leather-weekender',
      description: 'Full-grain Tuscan leather weekender bag with solid brass hardware.',
      price: 649,
      images: [{ url: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Bags',
      brand: 'Heritage',
      countInStock: 18,
      rating: 4.8,
      numReviews: 77,
      isFeatured: true,
      tags: ['premium', 'leather']
    },
    {
      title: 'Sapphire Automatic Watch',
      slug: 'sapphire-automatic-watch',
      description: 'Sapphire crystal, 200m water resistance, Swiss automatic movement.',
      price: 1290,
      images: [{ url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Accessories',
      brand: 'Aurelius',
      countInStock: 12,
      rating: 4.9,
      numReviews: 54,
      isFeatured: true,
      tags: ['premium', 'watch']
    },
    {
      title: 'Carbon Fiber Laptop Sleeve',
      slug: 'carbon-fiber-laptop-sleeve',
      description: 'Featherweight protection with genuine carbon fiber weave.',
      price: 199,
      images: [{ url: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Accessories',
      brand: 'CarbonCo',
      countInStock: 70,
      rating: 4.6,
      numReviews: 96,
      tags: ['premium', 'tech']
    },
    {
      title: 'Handwoven Cashmere Scarf',
      slug: 'handwoven-cashmere-scarf',
      description: 'Ultra-soft Himalayan cashmere, naturally dyed.',
      price: 229,
      images: [{ url: 'https://images.unsplash.com/photo-1520975857331-9c60f7f7d3cf?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Apparel',
      brand: 'Atelier',
      countInStock: 50,
      rating: 4.7,
      numReviews: 88,
      tags: ['premium', 'apparel']
    },
    {
      title: 'Artisan Pour-Over Kettle',
      slug: 'artisan-pour-over-kettle',
      description: 'Precision gooseneck kettle with variable temperature control.',
      price: 189,
      images: [{ url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Home',
      brand: 'BrewCraft',
      countInStock: 85,
      rating: 4.6,
      numReviews: 131,
      tags: ['premium', 'kitchen']
    },
    {
      title: 'Aviation Sunglasses',
      slug: 'aviation-sunglasses',
      description: 'Polarized lenses with titanium frame for all‑day comfort.',
      price: 289,
      images: [{ url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80&auto=format&fit=crop' }],
      category: 'Accessories',
      brand: 'Skyline',
      countInStock: 110,
      rating: 4.5,
      numReviews: 203,
      tags: ['premium', 'accessories']
    },
  ])

  return NextResponse.json({ ok: true })
}


