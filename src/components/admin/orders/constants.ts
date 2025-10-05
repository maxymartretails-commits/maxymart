export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  placed: "bg-green-200 text-green-900",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};


export const mockOrders = [
  {
    id: 'ORD-1001',
    customer: 'Alice',
    date: '2024-06-01',
    total: 45.0,
    status: 'Pending',
    items: [
      { name: 'Bananas', qty: 3, price: 1.99 },
      { name: 'Milk', qty: 2, price: 2.49 },
    ],
  },
  {
    id: 'ORD-1002',
    customer: 'Bob',
    date: '2024-06-02',
    total: 120.0,
    status: 'Shipped',
    items: [
      { name: 'Eggs', qty: 12, price: 3.99 },
      { name: 'Tomatoes', qty: 10, price: 1.29 },
    ],
  },
  {
    id: 'ORD-1003',
    customer: 'Charlie',
    date: '2024-06-03',
    total: 32.5,
    status: 'Delivered',
    items: [
      { name: 'Bananas', qty: 5, price: 1.99 },
    ],
  },
  {
    id: 'ORD-1004',
    customer: 'Diana',
    date: '2024-06-04',
    total: 80.0,
    status: 'Pending',
    items: [
      { name: 'Milk', qty: 10, price: 2.49 },
      { name: 'Eggs', qty: 6, price: 3.99 },
    ],
  },
];
