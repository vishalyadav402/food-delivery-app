"use client";

const MenuSkelton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2">

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-2 shadow-sm animate-pulse"
        >
          {/* IMAGE */}
          <div className="h-28 bg-gray-200 rounded-md"></div>

          {/* NAME */}
          <div className="mt-2 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* VARIANT */}
          <div className="flex gap-1 mt-2">
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
          </div>

          {/* PRICE + BUTTON */}
          <div className="flex justify-between items-center mt-4">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}

    </div>
  );
};

export default MenuSkelton;