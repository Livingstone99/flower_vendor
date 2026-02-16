"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-12">
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-8">Shopping Cart</h1>
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = totalPrice / 100;
  const shipping = 5.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = (item.product.price_cents / 100).toFixed(2);
            const itemTotal = ((item.product.price_cents * item.quantity) / 100).toFixed(2);

            return (
              <div
                key={item.product.id}
                className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 flex gap-6"
              >
                <Link href={`/p/${item.product.slug}`} className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <Link href={`/p/${item.product.slug}`}>
                    <h3 className="text-lg font-semibold text-[#111812] dark:text-white mb-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#618965] dark:text-primary/70 mb-4">${price} each</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</label>
                      <div className="flex items-center border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 bg-white dark:bg-[#1d2d1e] hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-3 py-1 text-center border-x border-[#f0f4f0] dark:border-[#2a3a2c] bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 bg-white dark:bg-[#1d2d1e] hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-[#111812] dark:text-white">${itemTotal}</span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="pt-4">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#f0f4f0] dark:border-[#2a3a2c] pt-3 mt-3">
                <div className="flex justify-between font-bold text-xl text-[#111812] dark:text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-primary-dark transition-colors mb-3"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="block w-full text-center text-[#618965] dark:text-primary/70 hover:text-primary transition-colors text-sm font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
