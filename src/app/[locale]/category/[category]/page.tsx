import React from "react";

//components
import Categories from "@/components/category/Categories";

export const metadata = {
  title: "Categories | My Shop",
  description: "Browse product categories on My Shop.",
};

const Page = () => {
  return (
    <main>
      <section aria-label="Product Categories">
        <Categories />
      </section>
    </main>
  );
};

export default Page;

