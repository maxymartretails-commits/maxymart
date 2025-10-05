"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";

// third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

// components
import CircleCheckbox from "../circle-checkbox/CircleCheckbox";
import { useRouter, useSearchParams } from "next/navigation";

// types
type category = {
  id: string;
  name: string;
};

type CategoryAccordionProps = {
  title: string;
  image: string;
  subcategories: category[];
  isLast: boolean;
};

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  title,
  image,
  subcategories,
  isLast,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [checkedItems, setCheckedItems] = useState<category | null>(null);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const handleCheck = (id: string, name: string, value: boolean) => {
    if(value){
      setCheckedItems({id,name});
    }else{
      setCheckedItems(null);
    }
  };

  useEffect(() => {
    if(checkedItems?.id){
      params.set('subCategoryId',checkedItems?.id);
      router.push(`?${params?.toString()}`);
    }
  },[checkedItems])

  return (
    <div>
      {/* Accordion Header */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer ${
          isLast ? "" : "border-b border-gray-200"
        }`}
        onClick={() => setDropdown(!dropdown)}
      >
        <div className="flex items-center gap-2.5">
          <Image src={image} alt={title} width={40} height={40} />
          <p className="text-[15px]">{title}</p>
        </div>
        {subcategories?.length > 0 && (
          <FontAwesomeIcon
            icon={dropdown ? faAngleUp : faAngleDown}
            className="w-3.5 h-3.5"
          />
        )}
      </div>

      {/* Accordion Body */}
      {subcategories?.length > 0 && (
        <div
          className={`border border-gray-200 border-t-0 overflow-hidden transition-all duration-400 ease-in-out ${
            dropdown
              ? "max-h-[500px] opacity-100 px-4 py-2"
              : "max-h-0 opacity-0 px-0 py-0"
          }`}
        >
          {subcategories.map((item, index) => (
            <div
              key={item.id}
              className={`flex justify-between items-center py-3 ${
                index !== subcategories.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <p>{item.name}</p>
              <CircleCheckbox
                checked={checkedItems?.id === item?.id}
                setChecked={(value) => handleCheck(item.id, item.name, value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
