"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Master from "@/app/components/Master";
import { supabase } from "@/app/utils/supabase";
import { useCart } from "@/app/context/CartContext";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const { productdetail, category, subcategory } = useParams();
  const router = useRouter();
  const { cart, addToCart, updateQty } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(slug), subcategories(slug)")
        .eq("slug", productdetail)
        .single();

      if (error || !data) {
        setProduct(null);
        setNotFound(true);
        setLoading(false);
        return;
      }

      // 👈 canonical slug check — redirect if URL category/subcategory don't match the product's real ones
      const realCategorySlug = data.categories?.slug;
      const realSubcategorySlug = data.subcategories?.slug;

      if (
        realCategorySlug &&
        realSubcategorySlug &&
        (category !== realCategorySlug || subcategory !== realSubcategorySlug)
      ) {
        router.replace(`/${realCategorySlug}/${realSubcategorySlug}/${data.slug}`);
        return; // 👈 bail out, redirect is in flight, avoid rendering with stale params
      }

      setProduct(data);
      setSelectedVariant(data?.variants?.[0] || {
        label: "Default",
        price: data?.price || 0,
        mrp: data?.mrp || data?.price || 0,
      });

      setLoading(false);
    };

    if (productdetail) fetchProduct();
  }, [productdetail, category, subcategory, router]);

  const cartItem = cart.find(
    (c) => c.slug === product?.slug && c.variant === selectedVariant?.label
  );

  if (loading) {
    return (
      <Master>
        <div className="flex flex-col md:grid md:grid-cols-2 px-4 gap-4 mt-4">
          <div className="p-4 bg-white rounded-xl animate-pulse">
            <div className="h-72 bg-gray-200 rounded-xl mx-auto w-3/4" />
            <div className="h-4 bg-gray-200 rounded mt-6 w-3/4" />
            <div className="h-3 bg-gray-200 rounded mt-3 w-full" />
            <div className="h-3 bg-gray-200 rounded mt-2 w-5/6" />
          </div>
          <div className="hidden md:flex flex-col p-10 bg-white rounded-xl animate-pulse gap-4">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-px bg-gray-200 w-full" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded-full w-1/2" />
          </div>
        </div>
      </Master>
    );
  }

  if (notFound || !product) {
    return (
      <Master>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Product not found 😔
        </div>
      </Master>
    );
  }

  const discount = selectedVariant?.mrp > selectedVariant?.price
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const CartButton = () => (
    cartItem ? (
      <div className="flex items-center justify-center gap-3 border-2 border-purple-500 rounded-full px-4 py-2">
        <button onClick={() => updateQty(product.slug, selectedVariant.label, cartItem.qty - 1)}>
          <Minus size={16} className="text-purple-600" />
        </button>
        <span className="font-bold text-purple-700 w-9 text-center">{cartItem.qty}</span>
        <button onClick={() => addToCart({
          slug: product.slug,
          name: product.name,
          image: product.image,
          variant: selectedVariant.label,
          price: selectedVariant.price,
        })}>
          <Plus size={16} className="text-purple-600" />
        </button>
      </div>
    ) : (
      <button
        onClick={() => addToCart({
          slug: product.slug,
          name: product.name,
          image: product.image,
          variant: selectedVariant.label,
          price: selectedVariant.price,
        })}
        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-full font-bold transition"
      >
        ADD TO CART
      </button>
    )
  );

  return (
    <Master>
      <div className="flex flex-col md:grid md:grid-cols-2 px-4 gap-4 mt-28 max-w-5xl mx-auto">

        {/* LEFT */}
        <div className="p-4 bg-white rounded-xl border border-gray-300">

          {discount > 0 && (
            <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded mb-2">
              {discount}% OFF
            </span>
          )}

          <div className="flex justify-center items-center h-64">
            <Image
              src={product.image || "/images/icon-vegacart.png"}
              alt={product.name}
              width={240}
              height={240}
              className="object-contain h-full w-auto"
            />
          </div>

          <div className="block md:hidden mt-4">
            <p className="text-lg font-semibold">{product.name}</p>

            {product.variants?.length > 1 && (
              <div className="flex gap-2 flex-wrap my-3">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      selectedVariant?.label === v.label
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center my-3">
              <div>
                <p className="text-xl font-bold text-purple-600">₹{selectedVariant?.price}</p>
                {discount > 0 && (
                  <p className="text-sm text-gray-400 line-through">₹{selectedVariant?.mrp}</p>
                )}
              </div>
              <CartButton />
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4 pt-4">
            <p className="text-base font-semibold mb-2">Product Details</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || product.name}
            </p>
          </div>
        </div>

        {/* RIGHT — desktop only */}
        <div className="hidden md:flex flex-col p-8 bg-white rounded-xl border border-gray-300">

          <p className="text-gray-400 text-xs capitalize">
            {category} / {subcategory} / {productdetail}
          </p>

          <p className="text-2xl font-bold mt-3 mb-1">{product.name}</p>

          <hr className="my-4 border border-gray-300" />

          {product.variants?.length > 1 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-sm px-4 py-1.5 rounded-full border ${
                      selectedVariant?.label === v.label
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-3xl font-bold text-purple-600">₹{selectedVariant?.price}</p>
            {discount > 0 && (
              <>
                <p className="text-gray-400 line-through text-lg">₹{selectedVariant?.mrp}</p>
                <span className="text-red-500 text-sm font-semibold">{discount}% off</span>
              </>
            )}
          </div>

          <CartButton />

          <hr className="my-6 border border-gray-300" />

          <div>
            <p className="font-semibold mb-3">Why shop from us?</p>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <p>🚚 Fast delivery in minutes</p>
              <p>✅ Best prices guaranteed</p>
              <p>🔄 Easy returns & refunds</p>
            </div>
          </div>
        </div>

      </div>
    </Master>
  );
};

export default Page;