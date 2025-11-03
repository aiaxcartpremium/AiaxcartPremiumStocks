export type Stock = {
  id: string
  product_key: string
  account_type: 'shared_profile'|'solo_profile'|'shared_acc'|'solo_acc'
  term_days: number
  price: number | null
  email: string | null
  password: string | null
  profile: string | null
  pin: string | null
  quantity: number
  notes: string | null
  expires_at: string
}
