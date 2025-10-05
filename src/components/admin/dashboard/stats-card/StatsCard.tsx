import React from "react";

//types
import { StatCardProps } from "../types";

const StatsCard = ({ icon, label, value, gradient }: StatCardProps) => {
  return (
    <div
      className={`flex items-center p-6 rounded-xl shadow-md text-white ${gradient} transition-transform hover:scale-105`}
    >
      <div className="mr-4">{icon}</div>
      <div>
        <div className="text-lg font-semibold">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
