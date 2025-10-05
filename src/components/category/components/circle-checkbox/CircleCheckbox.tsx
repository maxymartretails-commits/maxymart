"use client";

import React, { useState } from "react";


interface CircleCheckboxProps{
  checked:boolean;
  setChecked:(value:boolean) => void;
}
export default function CircleCheckbox({checked,setChecked}:CircleCheckboxProps) {
  return (
    <label className="inline-block cursor-pointer relative w-6 h-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="absolute opacity-0 w-6 h-6 m-0 cursor-pointer"
      />
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-red-600 transition-all duration-200 ease-in-out ${
          checked ? "bg-red-600" : "bg-transparent"
        }`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
    </label>
  );
}
