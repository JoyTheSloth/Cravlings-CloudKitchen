export const dishes = [
  {
    id: 'pizza',
    name: 'Cheesy Chicken Pizza',
    kitchen: "La Pino'z Cloud Kitchen",
    rating: '4.8',
    reviews: '1.2k',
    price: 249,
    time: '30-35 min',
    tags: ['Cheesy', 'Trending', 'all'],
    badge: 'Bestseller',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop',
    nutrition: { cal: 680, prot: '28g', fat: '22g', carb: '75g' }
  },
  {
    id: 'biryani',
    name: 'Hyderabadi Chicken Biryani',
    kitchen: 'Bong Dum Biryani House',
    rating: '4.7',
    reviews: '950',
    price: 199,
    time: '40-45 min',
    tags: ['Spicy', 'Trending', 'all'],
    badge: 'Popular',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop',
    nutrition: { cal: 750, prot: '24g', fat: '18g', carb: '95g' }
  },
  {
    id: 'comfort-ramen',
    name: 'Comfort Chicken Ramen',
    kitchen: 'Noodle Bowl Co.',
    rating: '4.9',
    reviews: '2.1k',
    price: 219,
    time: '25-30 min',
    tags: ['Comfort', 'all'],
    badge: 'Blobby\'s Choice',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop',
    nutrition: { cal: 520, prot: '22g', fat: '12g', carb: '68g' }
  },
  {
    id: 'healthy-salad',
    name: 'Quinoa Avocado Salad',
    kitchen: 'Green & Lean Kitchen',
    rating: '4.6',
    reviews: '580',
    price: 179,
    time: '15-20 min',
    tags: ['Healthy', 'all'],
    badge: 'Fitness Fresh',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
    nutrition: { cal: 320, prot: '12g', fat: '14g', carb: '35g' }
  },
  {
    id: 'lava-cake',
    name: 'Warm Chocolate Lava Cake',
    kitchen: 'Dessert Heaven',
    rating: '4.9',
    reviews: '3.4k',
    price: 129,
    time: '20-25 min',
    tags: ['Sweet', 'Trending', 'all'],
    badge: 'Must Have',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    nutrition: { cal: 450, prot: '6g', fat: '24g', carb: '55g' }
  },
  {
    id: 'sushi',
    name: 'Signature Sushi Roll',
    kitchen: 'Noodle Bowl Co.',
    rating: '4.8',
    reviews: '810',
    price: 349,
    time: '35-40 min',
    tags: ['Healthy', 'Trending', 'all'],
    badge: 'Premium',
    img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop',
    nutrition: { cal: 410, prot: '16g', fat: '8g', carb: '62g' }
  }
];

export const cloudKitchens = [
  {
    id: 'lapinoz',
    name: "La Pino'z Cloud Kitchen",
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop',
    cuisines: 'Pizzas, Pastas, Italian Desserts',
    rating: '4.8',
    time: '30-35 min',
    distance: '2.1 km',
    approved: true
  },
  {
    id: 'bongdum',
    name: 'Bong Dum Biryani House',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop',
    cuisines: 'Biryanis, Kebabs, Mughlai Cuisine',
    rating: '4.7',
    time: '40-45 min',
    distance: '3.4 km',
    approved: true
  },
  {
    id: 'noodlebowl',
    name: 'Noodle Bowl Co.',
    img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&auto=format&fit=crop',
    cuisines: 'Ramen, Sushi, Pan-Asian Bowls',
    rating: '4.9',
    time: '25-30 min',
    distance: '1.8 km',
    approved: true
  },
  {
    id: 'greenlean',
    name: 'Green & Lean Kitchen',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop',
    cuisines: 'Salads, Acai Bowls, Healthy Shakes',
    rating: '4.6',
    time: '15-20 min',
    distance: '2.8 km',
    approved: false
  },
  {
    id: 'dessertheaven',
    name: 'Dessert Heaven',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
    cuisines: 'Cakes, Waffles, Dessert Jars',
    rating: '4.9',
    time: '20-25 min',
    distance: '2.5 km',
    approved: true
  }
];
