'use client'
// app/contact/page.tsx
import { useTranslations } from "next-intl";
import React from "react";

const ContactUs = () => {
  const t = useTranslations("HomePage.contact-us");
  return (
    <div className="bg-gray-50 flex items-center justify-center items-center p-4 sm:p-6 md:p-8" style={{height: "calc(100vh - 171px)"}}>
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{t('contact_us')}</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {t('we_love_to_hear_from_you')}
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <input
                type="text"
                placeholder={t('your_name')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject')}</label>
              <input
                type="text"
                placeholder={t('subject')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
              <textarea
                rows={5}
                placeholder={t('your_message')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 sm:py-3 rounded-lg shadow-md transition"
            >
              {t('send_message')}
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">{t('get_in_touch')}</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {t('feel_free_to_reach')}
          </p>

          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="w-6 h-6 text-yellow-400 flex-shrink-0">📞</span>
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="w-6 h-6 text-yellow-400 flex-shrink-0">✉️</span>
            <span>support@maxymart.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <span className="w-6 h-6 text-yellow-400 flex-shrink-0">📍</span>
            <span>{t('address')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
