"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

type OfferInfoProps = {
  message: string;
  type?: "info" | "error" | "success";
};

export default function Info({ message, type = "info" }: OfferInfoProps) {
  const iconMap = {
    info: faInfoCircle,
    error: faTimesCircle,
    success: faCheckCircle,
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm",
        type === "info" && "bg-blue-50 text-blue-700",
        type === "error" && "bg-red-50 text-red-700",
        type === "success" && "bg-green-50 text-green-700"
      )}
    >
      <FontAwesomeIcon
        icon={iconMap[type]}
        className={clsx(
          "w-5 h-5",
          type === "info" && "text-blue-500",
          type === "error" && "text-red-500",
          type === "success" && "text-green-500"
        )}
      />
      <span className="text-xs">{message}</span>
    </div>
  );
}
