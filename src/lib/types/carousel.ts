import { Product } from "./products";

export type CarouselItem = {
  title: string;
  image: string;
};

export type CarouselProps = {
  title: string;
  items: Product[];
  onClick?: (item: CarouselItem) => void;
};