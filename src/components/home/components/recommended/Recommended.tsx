import React, { useState } from "react";
import Carousel from "../carousel/Carousel";
import { RecommendedProps } from "@/lib/types/recommended";
import { useTranslations } from "next-intl";

const Recommended = ({ items }: RecommendedProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('HomePage.popular_items');

  return (
    <section className="py-6 flex flex-col gap-4" aria-labelledby="recommended-section">
      <Carousel
        title={t('heading')}
        items={items}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Modal Content Here</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Recommended;
