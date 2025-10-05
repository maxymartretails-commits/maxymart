export type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
};

export type SalesTrendChartProps = {
  data: number[];
  days: string[];
  dark: boolean;
};