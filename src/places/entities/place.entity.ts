import { PlaceCategory } from "../enums/placeCategory.enum"
import { PlaceStatus } from "../enums/placeStatus.enum"

export class Place {
    id: string
    name: string
    description: string
    category: PlaceCategory
    address: string
    services: string[]
    status: PlaceStatus
    averageRating: number | null
    reviewCount: number
    createdAt: string
    updatedAt: string
}
