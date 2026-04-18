export interface Plan {
  id: number
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}
