"use client";

import React, { useEffect, useState } from "react";
import ImageMagnifier from "@/app/components/ImageMagnifier";
import { useParams } from "next/navigation";
import Master from "@/app/components/Master";
const Page = () => {

  const { productdetail, category, subcategory } = useParams();

  // 🔥 DUMMY PRODUCT DATA
  const dummyProduct = {
    id: 1,
    name: "Dove Shampoo 340ml",
    price: 249,
    description:
      "Nourishes deeply and strengthens hair. Suitable for daily use.",
    image: "/images/icon-vegacart.png",
  };

  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 🔥 simulate API delay
    setTimeout(() => {
      setProduct(dummyProduct);
    }, 300);
  }, []);

  return (
    <Master>
      <div className="flex flex-col md:grid md:grid-cols-2 px-4">

        {/* LEFT */}
        <div className="p-4 bg-white md:border">

          {/* IMAGE */}
          <div className="flex justify-center">
            <ImageMagnifier
              src={product?.image || "/images/icon-vegacart.png"}
              zoom={2}
            />
          </div>

          {/* MOBILE INFO */}
          <div className="block md:hidden mt-6">
            <p className="text-xl font-semibold">{product?.name}</p>

            <div className="flex justify-between items-center my-4">
              <div>
                <p className="text-sm">MRP ₹{product?.price}</p>
              </div>

              {/* <Addtocartbtn data={product} /> */}
            </div>
          </div>

          {/* DETAILS */}
          <div className="border-t my-6">
            <p className="text-lg font-semibold my-4">Product Details</p>

            <p className="text-sm text-gray-600">
              {product?.description}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hidden md:flex flex-col p-10 border">

          {/* BREADCRUMB */}
          <p className="text-gray-400 text-sm">
            {category} / {subcategory} / {productdetail}
          </p>

          {/* TITLE */}
          <p className="text-2xl font-semibold my-2">
            {product?.name}
          </p>

          <hr className="my-4" />

          {/* PRICE + CART */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              ₹{product?.price}
            </p>

            <Addtocartbtn data={product} />
          </div>

          {/* WHY SHOP */}
          <div className="mt-10">
            <p className="font-semibold mb-5">Why shop from Vega?</p>

            <p className="text-sm text-gray-500">
              Fast delivery, best prices, and wide assortment.
            </p>
          </div>

        </div>

      </div>
    </Master>
  );
};

export default Page;