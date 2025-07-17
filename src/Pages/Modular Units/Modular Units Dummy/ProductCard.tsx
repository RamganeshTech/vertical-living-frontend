import { Button } from "../../../components/ui/Button" 
import { Badge } from "../../../components/ui/Badge" 

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category?: string
  brand?: string
  isNew?: boolean
  isSale?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      {/* Product Image */}
      <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"}`}>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">New</Badge>}
          {product.isSale && <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Sale</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <i className="h-4 w-4 fas fa-hear" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <i className="h-4 w-4 fas fa-shopping-cart" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category || product.brand}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`h-4 w-4 fas fa-star ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full" size="sm">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
