import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/dummy-data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = (product.price_cents / 100).toFixed(0);

  return (
    <div className="min-w-[280px] flex-shrink-0 group">
      <Link href={`/p/${product.slug}`}>
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to favorites
            }}
          >
            <span className="material-symbols-outlined text-[20px] fill-transparent">favorite</span>
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">
              {product.attributes?.plant_environment
                ? product.attributes.plant_environment.charAt(0).toUpperCase() +
                product.attributes.plant_environment.slice(1)
                : product.kind === "vase"
                  ? "Hand-made Pottery"
                  : "Low Maintenance"}
            </p>
          </div>
          <p className="font-bold text-primary">${price}</p>
        </div>
      </Link>
    </div>
  );
}
