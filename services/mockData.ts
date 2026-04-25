import { Product } from '../types';

const REAL_PRODUCTS = [
  // ── Mobiles ──────────────────────────────────────────────────────────────
  { category: 'Mobiles', brand: 'Apple', title: 'iPhone 15 Pro 256GB Titanium', image: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'Samsung', title: 'Samsung Galaxy S24 Ultra 512GB', image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'OnePlus', title: 'OnePlus 12 5G 256GB Smartphone', image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'Redmi', title: 'Redmi Note 13 Pro+ 5G 256GB', image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'Vivo', title: 'Vivo V30 Pro 5G 12GB RAM', image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'Oppo', title: 'Oppo Find X7 Pro Camera Phone', image: 'https://images.pexels.com/photos/193004/pexels-photo-193004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'Realme', title: 'Realme GT 6 5G Gaming Phone', image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Mobiles', brand: 'iQOO', title: 'iQOO 12 Pro 5G 16GB RAM', image: 'https://images.pexels.com/photos/2643698/pexels-photo-2643698.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Electronics ──────────────────────────────────────────────────────────
  { category: 'Electronics', brand: 'Apple', title: 'MacBook Air M3 13-inch Laptop', image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Sony', title: 'Sony WH-1000XM5 Wireless Headphones', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Samsung', title: 'Samsung 65-inch 4K QLED Smart TV', image: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Apple', title: 'Apple AirPods Pro 2nd Gen ANC', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'HP', title: 'HP Pavilion 15 Gaming Laptop i7', image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Canon', title: 'Canon EOS R100 Mirrorless Camera', image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Boat', title: 'Boat Airdopes 141 True Wireless', image: 'https://images.pexels.com/photos/3394657/pexels-photo-3394657.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'JBL', title: 'JBL Flip 6 Portable Bluetooth Speaker', image: 'https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Dell', title: 'Dell XPS 15 OLED i9 Laptop', image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Electronics', brand: 'Lenovo', title: 'Lenovo ThinkPad X1 Carbon Ultrabook', image: 'https://images.pexels.com/photos/2148705/pexels-photo-2148705.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Fashion – Women ──────────────────────────────────────────────────────
  { category: 'Fashion', brand: 'H&M', title: 'Women Western Floral Printed Top', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Zara', title: 'Women Casual Solid Crop Top', image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Forever 21', title: 'Girls Stylish Western Tunic Top', image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Mango', title: 'Women Sleeveless Blouse Party Top', image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: "Levi's", title: "Levi's Women's Slim Fit Blue Jeans", image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Pepe Jeans', title: 'Women High-Waist Stretch Jeans', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'AND', title: 'Women Black Evening Gown Dress', image: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Vero Moda', title: 'Women Floral Midi Summer Dress', image: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'W for Woman', title: 'Women Cotton Straight Kurti Set', image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'BIBA', title: 'Women Ethnic Anarkali Kurti Floral', image: 'https://images.pexels.com/photos/8839895/pexels-photo-8839895.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Indya', title: 'Women Printed Salwar Suit Set', image: 'https://images.pexels.com/photos/3622616/pexels-photo-3622616.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Pothys', title: 'Women Pure Silk Saree Banarasi', image: 'https://images.pexels.com/photos/9558570/pexels-photo-9558570.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Fabindia', title: 'Women Cotton Floral Printed Saree', image: 'https://images.pexels.com/photos/9558571/pexels-photo-9558571.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Fashion – Men ────────────────────────────────────────────────────────
  { category: 'Fashion', brand: 'Allen Solly', title: 'Men Slim Fit Check Formal Shirt', image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: "Levi's", title: "Levi's Men's Skinny Fit Jeans Blue", image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Puma', title: 'Puma Men Graphic Printed Round-Neck T-shirt', image: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Nike', title: 'Nike Air Max 2024 Men Running Shoes', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Adidas', title: 'Adidas Men Core 18 Track Jacket', image: 'https://images.pexels.com/photos/5698852/pexels-photo-5698852.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Calvin Klein', title: 'Women Leather Block Heel Sandals', image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Ray-Ban', title: 'Ray-Ban Classic Aviator Sunglasses', image: 'https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Fashion', brand: 'Titan', title: 'Titan Men Quartz Analog Wrist Watch', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Grocery ──────────────────────────────────────────────────────────────
  { category: 'Grocery', brand: 'India Gate', title: 'India Gate Premium Basmati Rice 5kg', image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Fortune', title: 'Fortune Sunflower Refined Oil 2L', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Tata Sampann', title: 'Tata Sampann Toor Dal 1kg Premium', image: 'https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Britannia', title: 'Britannia Good Day Cashew Biscuits', image: 'https://images.pexels.com/photos/890515/pexels-photo-890515.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Cadbury', title: 'Cadbury Dairy Milk Silk 250g Bar', image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Amul', title: 'Amul Salted Butter 500g Block', image: 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Red Label', title: 'Brooke Bond Red Label Tea 500g', image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Nescafe', title: 'Nescafe Classic Instant Coffee 200g', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Grocery', brand: 'Maggi', title: 'Maggi 2-Minute Noodles Masala 12pk', image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Home ─────────────────────────────────────────────────────────────────
  { category: 'Home', brand: 'Bombay Dyeing', title: 'Double Bedsheet 300TC Cotton', image: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'IKEA', title: 'IKEA Modern Sofa 3-Seater L-Shape', image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'DDecor', title: 'Blackout Curtains Set of 2 Window', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'Wakefit', title: 'Wakefit Ortho Memory Foam Mattress', image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'Cello', title: 'Airtight Kitchen Storage Container 12pc', image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'Philips', title: 'Philips Dimmable LED Table Lamp', image: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Home', brand: 'Milton', title: 'Stainless Steel Non-Stick Cookware Set', image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Appliances ───────────────────────────────────────────────────────────
  { category: 'Appliances', brand: 'LG', title: 'LG 655L Side-by-Side Refrigerator', image: 'https://images.pexels.com/photos/3862369/pexels-photo-3862369.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Appliances', brand: 'Samsung', title: 'Samsung 8kg Front Load Washing Machine', image: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Appliances', brand: 'Voltas', title: 'Voltas 1.5 Ton 5 Star Split AC', image: 'https://images.pexels.com/photos/5591607/pexels-photo-5591607.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Appliances', brand: 'Bajaj', title: 'Bajaj 750W Mixer Grinder 4 Jars', image: 'https://images.pexels.com/photos/4397899/pexels-photo-4397899.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Appliances', brand: 'Philips', title: 'Philips 25L Microwave Oven Convection', image: 'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Appliances', brand: 'Dyson', title: 'Dyson V12 Detect Slim Vacuum Cleaner', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Travel ───────────────────────────────────────────────────────────────
  { category: 'Travel', brand: 'American Tourister', title: 'Hardshell Spinner Trolley 68L', image: 'https://images.pexels.com/photos/1170187/pexels-photo-1170187.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Travel', brand: 'Wildcraft', title: 'Wildcraft 60L Trekking Backpack', image: 'https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Travel', brand: 'Coleman', title: 'Camping Tent 4-Person Waterproof', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Travel', brand: 'Cabeau', title: 'Memory Foam Travel Neck Pillow', image: 'https://images.pexels.com/photos/3943715/pexels-photo-3943715.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Beauty ────────────────────────────────────────────────────────────────
  { category: 'Beauty', brand: 'MAC', title: 'MAC Ruby Woo Matte Lipstick', image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Maybelline', title: 'Maybelline Fit Me Liquid Foundation', image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Dior', title: 'Miss Dior Blooming Bouquet Perfume', image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Lakme', title: 'Lakme Eyeconic Kajal Black Kohl', image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Nykaa', title: 'Nykaa Wanderlust Nail Polish 12ml', image: 'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Neutrogena', title: 'Neutrogena Hydro Boost Water Gel SPF', image: 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Beauty', brand: 'Loreal', title: "L'Oreal Paris Elvive Shampoo 400ml", image: 'https://images.pexels.com/photos/3738344/pexels-photo-3738344.jpeg?auto=compress&cs=tinysrgb&w=400' },

  // ── Top Offers ────────────────────────────────────────────────────────────
  { category: 'Top Offers', brand: 'Sony', title: 'PlayStation 5 Console + Extra Controller', image: 'https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Top Offers', brand: 'Apple', title: 'iPhone 15 Pro Deal — Limited Offer', image: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Top Offers', brand: 'Nike', title: 'Nike Bestseller Mega Sale Shoes', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { category: 'Top Offers', brand: 'Samsung', title: 'Samsung Galaxy Tab S9 Deal', image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const CATEGORIES = ['Mobiles', 'Electronics', 'Fashion', 'Home', 'Appliances', 'Travel', 'Beauty', 'Top Offers', 'Grocery'];

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, index) => {
    const template = REAL_PRODUCTS[index % REAL_PRODUCTS.length];
    
    // Make price variation so duplicates look a bit different
    const price = Math.floor(Math.random() * 40000) + 1000;
    const discount = Math.floor(Math.random() * 40) + 5;
    const originalPrice = Math.floor(price * (100 / (100 - discount)));

    return {
      id: index + 1,
      title: template.title,
      description: `Experience the best quality with our ${template.title}. High durability, premium finish, and excellent performance guaranteed.`,
      price,
      originalPrice,
      discount,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      reviewCount: Math.floor(Math.random() * 5000),
      category: template.category,
      brand: template.brand,
      image: template.image,
      images: [
        template.image,
        template.image,
        template.image,
        template.image,
      ],
      isAssured: Math.random() > 0.3,
    };
  });
};

export const products: Product[] = generateProducts(600);

export const categories = [
  { 
    name: 'Top Offers', 
    img: 'https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Mobiles', 
    img: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Electronics', 
    img: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Fashion', 
    img: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Grocery', 
    img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Home', 
    img: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Appliances', 
    img: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Travel', 
    img: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  { 
    name: 'Beauty', 
    img: 'https://images.pexels.com/photos/2688992/pexels-photo-2688992.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
];
export const getProductById = (id: number) => products.find((p) => p.id === id);
