"use client";
import { useRouter } from "next/navigation";
import React from "react";

//types
import { CarouselProps } from "@/lib/types/carousel";

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  const router = useRouter();
  return (
    <section className="px-4">
      <h2 className="text-xl font-bold mb-3 text-[#181111]">{title}</h2>
      {items && items?.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {items?.map((item, idx) => (
            <div
              key={idx}
              className="w-[250px] flex-shrink-0 flex flex-col gap-2 cursor-pointer"
              onClick={() =>
                router.push(`category/groceries?categoryId=${item?.categoryId}`)
              }
            >
              <div
                className="aspect-square rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${item?.images[0]})` }}
              ></div>
              <p className="text-sm font-medium text-[#181111]">{item?.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-5 text-gray-600 font-sans">
          <p className="text-lg font-medium m-0">
            No Data Found
          </p>
        </div>
      )}
    </section>
  );
};

export default Carousel;
