import Image from "next/image";
import Link from "next/link";

//types
import { Product } from "@/lib/types/products";
import './section-card.css'

const SectionCard = ({ title, items,category }: { title: string; items: Product[],category:string }) => {
  return (
    <section className="py-8 px-4" aria-labelledby={title}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {items && items?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 cursor-pointer">
          {items?.map((item, index) => (
            <Link
              key={item.id}
              href={`category/${category}?categoryId=${item.categoryId}`}
              className="bg-white border rounded-xl p-3 shadow-sm text-center hover:shadow-md transition"
            >
              <Image
                src={item?.images?.[0] || ""}
                alt={item?.name}
                width={150}
                height={150}
                className="w-full h-24 object-cover rounded-md mb-2"
                priority={index < 3}
              />
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
            </Link>
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

export default SectionCard;
