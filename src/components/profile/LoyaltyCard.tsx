import React from "react";

const LoyaltyCard: React.FC = () => (
  <div className="max-w-2xl mx-auto mt-8 px-4">
    <div className="bg-gradient-to-r from-[#FFF176] to-[#FFD600] rounded-2xl shadow-lg p-6 flex items-center justify-between">
      <div>
        <div className="text-lg font-bold text-[#181111]">Loyalty Club</div>
        <div className="text-sm text-[#b59f00] font-semibold">
          Points: <span className="font-bold">0</span>
        </div>
        <div className="text-xs text-gray-700 mt-1">
          Unlock rewards as you shop!
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-[#b59f00]">🥇</span>
        <span className="text-xs text-[#b59f00] mt-1">Level 1</span>
      </div>
    </div>
  </div>
);

export default LoyaltyCard; 