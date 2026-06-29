import type { Category } from './category.model'

export class Product {
  id: number
  name: string
  description: string
  price: number
  category: Category
  image: string
  seller: string
  sellerCourse: string
  sellerInstitution: string
  location: string
  state: string
  condition: string
  interested: number

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    category: Category,
    image: string,
    seller = 'laura.fisio',
    sellerCourse = 'Fisioterapia',
    sellerInstitution = 'UNIFESP',
    location = 'Sao Paulo, SP',
    state = 'SP',
    condition = 'Usado em bom estado',
    interested = 0,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.price = price
    this.category = category
    this.image = image
    this.seller = seller
    this.sellerCourse = sellerCourse
    this.sellerInstitution = sellerInstitution
    this.location = location
    this.state = state
    this.condition = condition
    this.interested = interested
  }
}
