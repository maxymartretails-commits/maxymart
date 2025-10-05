import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      <aside className="w-100 md:w-65 bg-gray-800 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="hover:bg-gray-700 rounded px-3 py-2">
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Categories
          </Link>
          <Link
            href="/admin/brands"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Brands
          </Link>
          <Link
            href="/admin/offers"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Offers
          </Link>
          <Link
            href="/admin/deliverable-location"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Deliverable Location
          </Link>
          <Link
            href="/admin/sub-categories"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Sub Categories
          </Link>
          <Link
            href="/admin/orders"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Orders
          </Link>
          <Link
            href="/admin/users"
            className="hover:bg-gray-700 rounded px-3 py-2"
          >
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 min-h-screen">{children}</main>
    </div>
  );
}
