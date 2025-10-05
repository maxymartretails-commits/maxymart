"use client"
import { useTranslations } from "next-intl";
import Link from "next/link";

const NotFound = () => {
    const t = useTranslations('HomePage.not-found')
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-6" style={{ height: "calc(100vh - 168px)" }}>
            {/* Animated 404 */}
            <h1 className="text-8xl font-extrabold text-red-600 animate-bounce mb-6">
                404
            </h1>

            {/* Message */}
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {t('page_not_found')}
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                {t('sorry_page_doesnt_exist')}
            </p>

            {/* Back Home Button */}
            <Link
                href="/"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition transform hover:-translate-y-1"
            >
                {t('go_back_home')}
            </Link>
        </div>
    );
}

export default NotFound
