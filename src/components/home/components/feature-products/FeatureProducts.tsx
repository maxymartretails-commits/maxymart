import React from "react";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { faClock, faLeaf, faShield } from "@fortawesome/free-solid-svg-icons";

const FeatureProducts = () => {
  const t = useTranslations('HomePage.feature');
  const features = [
    {
      icon: faClock,
      title: t('fast_delivery'),
      description: t('fast_description'),
    },
    {
      icon: faLeaf,
      title: t('fresh_products'),
      description: t('fresh_desc'),
    },
    {
      icon: faShield,
      title: t('trust__quality'),
      description: t('trust_desc'),
    },
  ];
  return (
    <section
      aria-labelledby="feature-products-heading"
      className="mx-4 md:mx-12 my-10 shadow-md rounded-xl bg-gray-50 p-6 md:p-8 lg:p-10"
    >
      <h2
        id="feature-products-heading"
        className="sr-only"
      >
        Feature Products
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16 lg:gap-32">
        {features?.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center items-center text-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Icon */}
            <FontAwesomeIcon
              icon={feature?.icon}
              className="text-gray-700 w-[50px] h-[50px] md:w-[60px] md:h-[60px]"
              aria-hidden="true"
            />

            {/* Title */}
            <h3 className="mt-4 text-lg md:text-xl font-bold text-gray-900">
              {feature?.title}
            </h3>

            {/* Description */}
            <p className="mt-1 text-sm md:text-base text-gray-600">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureProducts;
