export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ArticleStatus = 'draft' | 'published'
export type OrderStatus = 'new' | 'invoiced' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type BookingStatus = 'new' | 'confirmed' | 'rejected' | 'completed'
export type MediaType = 'image' | 'video'
export type BookingType = 'match' | 'training' | 'half' | 'with_lights' | 'without_lights'
export type PartnerTier = 'hlavní' | 'partner' | 'mediální'
export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface ArticleCategory {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface Team {
  id: string
  name: string
  slug: string
  category: string | null
  competition_url: string | null
  schedule_url: string | null
  description: string | null
  photo_url: string | null
  position: number
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: Json | null
  hero_image_url: string | null
  category_id: string | null
  author_id: string | null
  team_id: string | null
  published_at: string | null
  status: ArticleStatus
  created_at: string
  updated_at: string
  // joins
  category?: ArticleCategory
  author?: Profile
  team?: Team
}

export interface ArticleMedia {
  id: string
  article_id: string
  type: MediaType
  url: string
  alt: string | null
  position: number
}

export interface Player {
  id: string
  team_id: string | null
  first_name: string | null
  last_name: string | null
  jersey_number: number | null
  position: string | null
  birth_year: number | null
  photo_url: string | null
}

export interface Coach {
  id: string
  team_id: string | null
  first_name: string | null
  last_name: string | null
  role: string | null
  phone: string | null
  email: string | null
  photo_url: string | null
}

export interface Match {
  id: string
  team_id: string | null
  opponent: string
  kick_off_at: string | null
  is_home: boolean | null
  venue: string | null
  score_home: number | null
  score_away: number | null
  report_article_id: string | null
  fotbal_cz_url: string | null
  // joins
  team?: Team
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  tier: PartnerTier
  position: number
}

export interface GalleryAlbum {
  id: string
  title: string
  slug: string | null
  cover_url: string | null
  event_date: string | null
  team_id: string | null
}

export interface GalleryItem {
  id: string
  album_id: string
  type: MediaType
  url: string
  caption: string | null
  position: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  description: string | null
  price: number
  sizes: string[] | null
  colors: string[] | null
  images: string[] | null
  in_stock: boolean
  status: 'draft' | 'published'
  jako_sku: string | null
  created_at: string
  // joins
  category?: ProductCategory
}

export interface Order {
  id: string
  order_number: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: Json | null
  note: string | null
  subtotal: number | null
  shipping_cost: number
  total: number | null
  status: OrderStatus
  created_at: string
  // joins
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string | null
  size: string | null
  color: string | null
  quantity: number
  unit_price: number | null
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  from_status: string | null
  to_status: string | null
  changed_by: string | null
  note: string | null
  created_at: string
}

export interface FieldBooking {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  club_name: string | null
  requested_date: string
  time_from: string | null
  time_to: string | null
  booking_type: BookingType | null
  note: string | null
  status: BookingStatus
  created_at: string
}

export interface Setting {
  key: string
  value: Json
  updated_at: string
}

// Cart (localStorage only — no DB table)
export interface CartItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
  size: string | null
  color: string | null
  image: string | null
}
