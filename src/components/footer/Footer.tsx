import React from "react";

//third-party
import {
  faSquareFacebook,
  faSquareInstagram,
  faSquareTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="bg-white bottom-0 w-full fixed">
      <div className="border-b border-gray-300"></div>

      <div className="flex flex-row-reverse justify-between items-center px-6 py-6">
        <div className="flex justify-center gap-4">
          <FontAwesomeIcon
            icon={faSquareTwitter}
            className="w-5 h-5 text-gray-700 hover:text-blue-500"
          />
          <FontAwesomeIcon
            icon={faSquareInstagram}
            className="w-5 h-5 text-gray-700 hover:text-pink-500"
          />
          <FontAwesomeIcon
            icon={faSquareFacebook}
            className="w-5 h-5 text-gray-700 hover:text-blue-700"
          />
        </div>

        <p className="text-center text-xs text-gray-500">
          © 2024 HouseWife Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
