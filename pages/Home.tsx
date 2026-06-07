import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { products } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  Gift, 
  Star,
  Smartphone,
  Shirt,
  Laptop,
  Home as HomeIcon,
  ShoppingBag,
  Gamepad2,
  Gem,
  Coffee,
  Plane,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FASHION_SUB = [
    "Cotton T-Shirt", "Oversized T-Shirt", "Polo T-Shirt", "Graphic T-Shirt", "Full Sleeve T-Shirt",
    "Casual Shirt", "Formal Shirt", "Checked Shirt", "Denim Shirt", "Linen Shirt", "Slim Fit Jeans",
    "Regular Fit Jeans", "Skinny Jeans", "Ripped Jeans", "Cargo Jeans", "Chinos Pants", "Formal Trousers",
    "Jogger Pants", "Cargo Pants", "Track Pants", "Shorts", "Denim Shorts", "Capri Pants", "Hoodie",
    "Zip Hoodie", "Sweatshirt", "Sweater", "Cardigan", "Bomber Jacket", "Denim Jacket", "Leather Jacket",
    "Winter Coat", "Blazer", "Waistcoat", "Kurti", "Printed Kurti", "Anarkali Kurti", "Straight Kurti",
    "Saree", "Silk Saree", "Cotton Saree", "Georgette Saree", "Lehenga Choli", "Bridal Lehenga",
    "Salwar Suit", "Palazzo Suit", "Dupatta", "Leggings", "Jeggings", "Palazzo Pants", "Skirt",
    "Mini Skirt", "Midi Skirt", "Maxi Skirt", "Pencil Skirt", "Bodycon Dress", "Maxi Dress", "Midi Dress",
    "Floral Dress", "Party Dress", "Evening Gown", "Crop Top", "Tank Top", "Peplum Top", "Off Shoulder Top",
    "Tunic Top", "Blouse", "Shawl", "Stole", "Scarf", "Muffler", "Socks", "Ankle Socks", "Stockings",
    "Sneakers", "Running Shoes", "Casual Shoes", "Formal Shoes", "Loafers", "Boots", "Heels", "Sandals",
    "Slippers", "Flats", "Handbag", "Tote Bag", "Sling Bag", "Clutch Bag", "Backpack", "Wallet", "Belt",
    "Cap", "Hat", "Sunglasses", "Wrist Watch", "Bracelet", "Necklace", "Earrings", "Ring", "Hair Band"
  ];

  const ELECTRONICS_SUB = [
    "Smartphone", "Feature Phone", "Foldable Phone", "Gaming Phone", "Tablet", "iPad", "Laptop", "Gaming Laptop",
    "Ultrabook Laptop", "Chromebook", "Desktop Computer", "All in One PC", "Mini PC", "Monitor", "Curved Monitor",
    "LED TV", "Smart TV", "OLED TV", "QLED TV", "Android TV", "Bluetooth Speaker", "Soundbar", "Home Theatre",
    "Wireless Earbuds", "Neckband Earphones", "Wired Earphones", "Over Ear Headphones", "Noise Cancelling Headphones",
    "Gaming Headset", "Smart Watch", "Fitness Band", "Smart Ring", "Power Bank", "Fast Charger", "Wireless Charger",
    "USB Cable", "Type C Cable", "HDMI Cable", "Pendrive", "Memory Card", "External Hard Drive", "SSD Drive",
    "Portable SSD", "Router", "WiFi Extender", "Modem", "Webcam", "Printer", "Inkjet Printer", "Laser Printer",
    "Scanner", "Projector", "Mini Projector", "DSLR Camera", "Mirrorless Camera", "Action Camera", "Security Camera",
    "CCTV Camera", "Drone Camera", "Camera Lens", "Camera Tripod", "Gimbal Stabilizer", "Microphone", "USB Microphone",
    "Bluetooth Mic", "Keyboard", "Mechanical Keyboard", "Wireless Keyboard", "Mouse", "Wireless Mouse", "Gaming Mouse",
    "Mouse Pad", "Graphic Tablet", "UPS Backup", "Inverter Battery", "Voltage Stabilizer", "Calculator", "Digital Clock",
    "Alarm Clock", "Smart Bulb", "LED Bulb", "Smart Plug", "Extension Board", "Surge Protector", "Electric Kettle",
    "Induction Cooktop", "Mixer Grinder", "Air Fryer", "Rice Cooker", "Microwave Oven", "OTG Oven", "Refrigerator",
    "Mini Fridge", "Washing Machine", "Front Load Washer", "Top Load Washer", "Clothes Dryer", "Vacuum Cleaner",
    "Robot Vacuum", "Air Purifier", "Humidifier", "Room Heater", "Fan", "Tower Fan", "Air Cooler", "Air Conditioner",
    "Split AC", "Window AC", "Water Purifier", "Geyser", "Electric Iron", "Steam Iron", "Hair Dryer", "Hair Straightener",
    "Beard Trimmer", "Electric Shaver", "Epilator", "Massager Machine", "Treadmill", "Exercise Bike", "Gaming Console",
    "Handheld Console", "VR Headset", "Smart Glasses", "Car Charger", "Dash Camera", "GPS Navigator", "Car Vacuum Cleaner",
    "Portable Fan", "Digital Weighing Scale", "Kitchen Weighing Scale", "Barcode Scanner", "Label Printer", "Card Reader",
    "Docking Station", "Laptop Stand", "Cooling Pad", "Stylus Pen", "Smart Door Lock", "Video Doorbell", "Baby Monitor",
    "Walkie Talkie", "FM Radio", "Bluetooth Receiver", "Streaming Device", "TV Remote", "Universal Remote", "Smart Sensor",
    "E-Reader", "Solar Power Bank"
  ];

  const APPLIANCES_SUB = [
    "Refrigerator", "Double Door Refrigerator", "Mini Fridge", "Deep Freezer", "Washing Machine",
    "Front Load Washing Machine", "Top Load Washing Machine", "Semi Automatic Washer", "Clothes Dryer",
    "Washer Dryer Combo", "Air Conditioner", "Split AC", "Window AC", "Portable AC", "Air Cooler",
    "Desert Cooler", "Personal Cooler", "Tower Cooler", "Ceiling Fan", "Table Fan", "Pedestal Fan",
    "Wall Fan", "Exhaust Fan", "Tower Fan", "Room Heater", "Blower Heater", "Oil Heater", "Fan Heater",
    "Geyser", "Instant Water Heater", "Solar Water Heater", "Immersion Rod", "Water Purifier",
    "RO Water Purifier", "UV Water Purifier", "Water Dispenser", "Microwave Oven", "Convection Microwave",
    "OTG Oven", "Electric Oven", "Air Fryer", "Toaster", "Sandwich Maker", "Waffle Maker", "Pizza Maker",
    "Coffee Maker", "Espresso Machine", "Electric Kettle", "Rice Cooker", "Digital Rice Cooker",
    "Induction Cooktop", "Gas Stove", "2 Burner Gas Stove", "4 Burner Gas Stove", "Kitchen Chimney",
    "Dishwasher", "Mixer Grinder", "Juicer Mixer Grinder", "Hand Blender", "Food Processor",
    "Vegetable Chopper", "Egg Boiler", "Roti Maker", "Chapati Maker", "Bread Maker", "Ice Cream Maker",
    "Yogurt Maker", "Pressure Cooker Electric", "Slow Cooker", "Multi Cooker", "Steam Iron", "Dry Iron",
    "Garment Steamer", "Vacuum Cleaner", "Robot Vacuum Cleaner", "Handheld Vacuum Cleaner", "Wet Dry Vacuum",
    "Steam Mop", "Floor Scrubber", "Air Purifier", "Mini Air Purifier", "Humidifier", "Dehumidifier",
    "Aroma Diffuser", "Hair Dryer", "Hair Straightener", "Hair Curler", "Beard Trimmer", "Electric Shaver",
    "Body Groomer", "Epilator", "Facial Steamer", "Foot Massager", "Neck Massager", "Back Massager",
    "Smart Refrigerator", "Smart Washing Machine", "Smart AC", "Smart Vacuum Cleaner", "Smart Water Purifier",
    "Smart Ceiling Fan", "Smart Chimney", "Smart Coffee Maker", "Smart Humidifier", "Smart Door Lock",
    "Video Doorbell", "Home Inverter", "Inverter Battery", "UPS Backup", "Voltage Stabilizer",
    "Solar Inverter", "Water Pump", "Pressure Washer", "Mosquito Killer Lamp", "Electric Insect Killer Bat",
    "Sewing Machine", "Towel Warmer", "Heated Blanket", "Electric Mattress Warmer", "Shoe Dryer", "Boot Warmer",
    "Bottle Sterilizer", "Baby Food Maker", "Portable Heater Fan", "Portable Water Heater", "Rechargeable Fan",
    "Cordless Vacuum Cleaner", "Stick Vacuum Cleaner", "Countertop Dishwasher", "Compact Dishwasher",
    "Glass Top Gas Stove", "Copper Motor Mixer Grinder", "Silent Juicer", "Slow Juicer", "Auto Clean Chimney",
    "Touch Panel Chimney", "WiFi Air Conditioner", "Smart Speaker Hub", "Laundry Steamer", "Clothes Drying Rack",
    "Digital Kitchen Scale", "Smart Plug", "Electric Lunch Box", "Mini Washing Machine", "Portable Blender",
    "Popcorn Maker", "Mini Vacuum Cleaner", "Ice Maker Machine", "Food Warmer", "Dish Drying Machine"
  ];

  const GROCERY_SUB = [
    "Basmati Rice", "Wheat Flour", "Maida Flour", "Suji Semolina", "Besan Gram Flour", "Poha",
    "Vermicelli", "Oats", "Corn Flour", "Rava", "Toor Dal", "Moong Dal", "Masoor Dal", "Chana Dal",
    "Urad Dal", "Rajma", "Kabuli Chana", "Black Chana", "Soybean", "Green Peas Dry", "Sugar",
    "Jaggery", "Salt", "Rock Salt", "Tea Powder", "Coffee Powder", "Green Tea", "Cocoa Powder",
    "Honey", "Jam", "Mustard Oil", "Sunflower Oil", "Soybean Oil", "Olive Oil", "Coconut Oil",
    "Ghee", "Butter", "Margarine", "Vinegar", "Tomato Ketchup", "Turmeric Powder", "Red Chilli Powder",
    "Coriander Powder", "Cumin Seeds", "Garam Masala", "Black Pepper", "Cardamom", "Cloves",
    "Cinnamon", "Mustard Seeds", "Maggi Noodles", "Pasta", "Macaroni", "Instant Soup", "Ready Upma Mix",
    "Ready Poha Mix", "Biscuit Pack", "Cookies", "Rusks", "Bread", "Brown Bread", "Burger Buns",
    "Pizza Base", "Peanut Butter", "Chocolate Spread", "Cornflakes", "Muesli", "Chips Packet",
    "Namkeen Mix", "Popcorn", "Soft Drink", "Fruit Juice", "Energy Drink", "Soda Water", "Mineral Water",
    "Milk", "Curd", "Paneer", "Cheese Slices", "Fresh Cream", "Eggs", "Chicken Sausage", "Frozen Nuggets",
    "Frozen Peas", "Frozen French Fries", "Ice Cream", "Chocolate Bar", "Candy Pack", "Dry Fruits Mix",
    "Almonds", "Cashews", "Raisins", "Walnuts", "Pistachios", "Dates", "Detergent Powder", "Dishwash Liquid",
    "Hand Wash", "Toilet Cleaner", "Garbage Bags"
  ];

  const BEAUTY_SUB = [
    "Primer", "Face Primer Gel", "Pore Minimizer Primer", "Hydrating Primer", "Illuminating Primer",
    "Foundation", "Liquid Foundation", "Matte Foundation", "Powder Foundation", "Stick Foundation",
    "BB Cream", "CC Cream", "Tinted Moisturizer", "Concealer", "Color Corrector", "Compact Powder",
    "Loose Powder", "Setting Powder", "Banana Powder", "Makeup Fixer Spray", "Setting Spray",
    "Blush", "Cream Blush", "Powder Blush", "Liquid Blush", "Bronzer", "Contour Stick", "Contour Powder",
    "Highlighter", "Liquid Highlighter", "Glow Drops", "Face Palette", "Makeup Palette", "Lipstick",
    "Matte Lipstick", "Cream Lipstick", "Satin Lipstick", "Liquid Lipstick", "Lip Gloss", "Lip Balm",
    "Tinted Lip Balm", "Lip Liner", "Lip Crayon", "Lip Stain", "Lip Tint", "Lip Oil", "Lip Scrub",
    "Lip Mask", "Nude Lipstick", "Red Lipstick", "Kajal", "Eyeliner", "Gel Eyeliner", "Liquid Eyeliner",
    "Pencil Eyeliner", "Mascara", "Waterproof Mascara", "Volume Mascara", "Lengthening Mascara",
    "Eyebrow Pencil", "Brow Powder", "Brow Gel", "Brow Pomade", "Eyeshadow Palette", "Nude Eyeshadow Palette",
    "Glitter Eyeshadow", "Cream Eyeshadow", "Single Eyeshadow", "Eye Primer", "False Eyelashes",
    "Lash Glue", "Lash Curler", "Glitter Liner", "Kohl Pencil", "Nail Polish", "Matte Nail Polish",
    "Gel Nail Polish", "Glitter Nail Polish", "Top Coat", "Base Coat", "Nail Remover", "Cuticle Oil",
    "Nail File", "Nail Buffer", "Nail Art Stickers", "Makeup Brush Set", "Foundation Brush",
    "Powder Brush", "Blush Brush", "Eyeshadow Brush", "Beauty Blender", "Makeup Sponge", "Cotton Pads",
    "Makeup Remover Wipes", "Micellar Water", "Vanity Mirror", "Makeup Organizer", "Cosmetic Bag",
    "Sharpener", "Tweezer", "Face Wash", "Cleanser", "Facial Scrub", "Toner", "Moisturizer", "Day Cream", "Night Cream",
    "Sunscreen Lotion", "Shampoo", "Conditioner", "Hair Serum", "Hair Oil", "Hair Mask"
  ];

  const TRAVEL_SUB = [
    "Travel Backpack", "Trolley Suitcase", "Cabin Luggage", "Large Suitcase", "Duffel Bag",
    "Weekender Bag", "Laptop Travel Bag", "Sling Travel Bag", "Crossbody Bag", "Hiking Backpack",
    "Passport Cover", "Passport Holder", "Travel Wallet", "Card Holder", "Document Organizer",
    "Ticket Holder", "Money Belt", "Luggage Tag", "Name Tag", "Travel Pouch Set", "Neck Pillow",
    "Memory Foam Pillow", "Eye Mask", "Ear Plugs", "Travel Blanket", "Seat Cushion", "Inflatable Pillow",
    "Sleeping Bag", "Compact Towel", "Picnic Mat", "Water Bottle", "Insulated Flask", "Thermos Bottle",
    "Lunch Box", "Snack Box", "Foldable Cup", "Coffee Mug Travel", "Portable Spoon Set", "Cooler Bag",
    "Ice Pack", "Power Bank", "Universal Travel Adapter", "Mobile Charger", "Car Charger", "Charging Cable",
    "Wireless Charger", "Bluetooth Earbuds", "Headphones", "Selfie Stick", "Camera Bag", "Action Camera",
    "Tripod Stand", "Portable Speaker", "Flashlight Torch", "Headlamp", "GPS Tracker", "Smart Watch",
    "Travel Alarm Clock", "E-Reader", "Portable Fan", "Raincoat", "Umbrella", "Windcheater Jacket",
    "Travel Shoes", "Flip Flops", "Compression Socks", "Winter Gloves", "Wool Cap", "Scarf", "Sunglasses",
    "Toiletry Bag", "Shampoo Bottle Set", "Soap Case", "Toothbrush Cover", "Travel Razor", "Wet Wipes",
    "Tissue Pack", "Sanitizer Bottle", "First Aid Kit", "Medicine Box", "Laundry Bag", "Shoe Bag",
    "Packing Cubes", "Vacuum Storage Bag", "Zip Lock Pouches", "Garment Cover", "Foldable Hanger",
    "Iron Mini", "Sewing Kit", "Safety Lock", "TSA Lock", "Luggage Strap", "Bungee Cord", "Car Organizer",
    "Map Book", "Travel Journal", "Pen Set", "Binoculars", "Mosquito Repellent Spray", "Camping Stove"
  ];

  const SPORTS_SUB = [
    "Cricket Bat", "Cricket Ball", "Tennis Ball", "Football", "Basketball", "Volleyball", "Rugby Ball",
    "Badminton Racket", "Shuttlecock", "Table Tennis Bat", "Table Tennis Ball", "Tennis Racket",
    "Tennis Net", "Hockey Stick", "Hockey Ball", "Baseball Bat", "Baseball Glove", "Golf Club Set",
    "Golf Ball Set", "Bowling Ball", "Carrom Board", "Carrom Coins Set", "Chess Board", "Dart Board",
    "Skipping Rope", "Hula Hoop", "Frisbee Disc", "Yo-Yo Toy Sports", "Boxing Gloves", "Punching Bag",
    "Boxing Head Guard", "MMA Gloves", "Karate Uniform", "Karate Belt", "Taekwondo Pads", "Gym Dumbbells",
    "Kettlebell", "Barbell Rod", "Weight Plates", "Resistance Band", "Pull Up Bar", "Push Up Stand",
    "Exercise Mat", "Yoga Mat", "Foam Roller", "Treadmill", "Exercise Cycle", "Rowing Machine",
    "Elliptical Trainer", "Stepper Machine", "Running Shoes", "Sports Socks", "Knee Support",
    "Elbow Support", "Wrist Band", "Head Band", "Sweat Band", "Sports Gloves", "Shin Guard",
    "Ankle Guard", "Swimming Goggles", "Swim Cap", "Swimming Costume", "Kick Board", "Life Jacket",
    "Snorkel Set", "Bicycle", "Mountain Bike", "Cycling Helmet", "Cycle Pump", "Cycle Lock", "Skateboard",
    "Roller Skates", "Inline Skates", "Scooter Sports", "Camping Tent", "Sleeping Bag", "Hiking Pole",
    "Climbing Rope", "Compass", "Archery Bow", "Archery Arrows", "Fishing Rod", "Fishing Reel",
    "Fishing Net", "Sports Water Bottle", "Protein Shaker Bottle", "Stopwatch", "Whistle", "Score Board",
    "Referee Card Set", "Sports Bag", "Gym Bag", "Medal Trophy", "Training Cone Set", "Agility Ladder",
    "Jump Box", "Balance Board", "Hand Grip Strengthener", "Massage Gun"
  ];

  const TOYS_SUB = [
    "Teddy Bear", "Barbie Doll", "Baby Doll", "Action Figure", "Superhero Figure", "Robot Toy",
    "Remote Control Car", "Toy Racing Car", "Toy Truck", "Toy Bus", "Toy Train Set", "Toy Airplane",
    "Helicopter Toy", "Toy Boat", "Construction Crane Toy", "Excavator Toy", "Monster Truck Toy",
    "Police Car Toy", "Fire Truck Toy", "Ambulance Toy", "Building Blocks", "Lego Block Set",
    "Magnetic Blocks", "Puzzle Cube", "Jigsaw Puzzle", "Shape Sorter", "Number Puzzle", "Alphabet Puzzle",
    "Stacking Rings", "Wooden Blocks", "Toy Kitchen Set", "Toy Tea Set", "Doctor Set Toy", "Tool Kit Toy",
    "Cash Register Toy", "Makeup Kit Toy", "Toy Grocery Set", "Doll House", "Doll Furniture Set",
    "Toy Washing Machine", "Toy Vacuum Cleaner", "Toy Laptop", "Toy Mobile Phone", "Toy Camera",
    "Toy Keyboard Piano", "Musical Drum Toy", "Xylophone Toy", "Guitar Toy", "Trumpet Toy", "Karaoke Mic Toy",
    "Stuffed Panda", "Stuffed Rabbit", "Stuffed Elephant", "Stuffed Unicorn", "Plush Dinosaur", "Soft Ball",
    "Squeeze Toy", "Slime Toy", "Pop It Toy", "Fidget Spinner", "Water Gun", "Bubble Gun", "Bubble Maker",
    "Flying Disc", "Boomerang Toy", "Skipping Rope Kids", "Mini Basketball Set", "Toy Football",
    "Toy Cricket Bat", "Bowling Set Toy", "Board Game Ludo", "Chess Set Kids", "Snake and Ladder",
    "UNO Cards", "Memory Card Game", "Domino Set", "Dart Board Kids", "Ring Toss Game", "Tic Tac Toe Game",
    "Magic Kit", "Science Experiment Kit", "Painting Kit", "Color Pencil Set", "Clay Dough Set",
    "Craft Kit", "Sticker Book", "Drawing Board", "LCD Writing Tablet", "Story Book Toy", "Flash Cards Set",
    "Ride On Car", "Tricycle", "Baby Walker Toy", "Rocking Horse", "Scooter Kids", "Toy Tent House",
    "Tunnel Play Tent", "Sand Bucket Set", "Beach Toy Set", "Puppet Toy Set"
  ];

  const SNEAKERS_SUB = [
    "Nike Air Force 1", "Nike Air Max 90", "Nike Air Max 97", "Nike Air Max 270", "Nike Air Max 720",
    "Nike Dunk Low", "Nike Dunk High", "Nike Blazer Mid", "Nike Court Vision", "Nike Revolution 6",
    "Nike Pegasus 40", "Nike React Infinity Run", "Nike Zoom Fly 5", "Nike Metcon 9", "Nike Free Run 5.0",
    "Adidas Superstar", "Adidas Stan Smith", "Adidas Gazelle", "Adidas Samba", "Adidas Campus 00s",
    "Adidas Ultraboost Light", "Adidas NMD R1", "Adidas Forum Low", "Adidas Ozweego", "Adidas Duramo SL",
    "Puma Smash V2", "Puma RS-X", "Puma Suede Classic", "Puma Future Rider", "Puma Flyer Runner",
    "Puma Caven 2.0", "Puma Cali Dream", "Reebok Club C 85", "Reebok Classic Leather", "Reebok Nano X3",
    "Reebok Zig Kinetica", "Reebok Floatride Energy", "New Balance 574", "New Balance 327", "New Balance 550",
    "New Balance 9060", "New Balance Fresh Foam 1080", "New Balance 2002R", "Converse Chuck Taylor Low",
    "Converse Chuck Taylor High", "Converse Run Star Hike", "Converse Weapon", "Vans Old Skool",
    "Vans Sk8 Hi", "Vans Authentic", "Vans Slip On", "Vans Knu Skool", "Skechers Go Walk 6",
    "Skechers Arch Fit", "Skechers D'Lites", "Skechers Max Cushioning", "Asics Gel Kayano 30",
    "Asics Gel Nimbus 26", "Asics Gel Lyte III", "Asics GT 2000", "Asics Patriot 13", "Under Armour HOVR Phantom",
    "Under Armour Charged Assert", "Under Armour Curry Flow", "Under Armour Spawn 5", "Jordan 1 Low",
    "Jordan 1 Mid", "Jordan 1 High", "Jordan 4 Retro", "Jordan 6 Rings", "Jordan Max Aura", "Yeezy Boost 350",
    "Yeezy 500", "Yeezy 700", "Yeezy Slide", "Fila Disruptor II", "Fila Ray Tracer", "Fila Memory Workshift",
    "Hoka Clifton 9", "Hoka Bondi 8", "Hoka Mach 6", "Hoka Arahi 7", "Brooks Ghost 16", "Brooks Adrenaline GTS 23",
    "Brooks Launch 10", "Saucony Ride 17", "Saucony Endorphin Speed 4", "Saucony Jazz Original",
    "Merrell Jungle Moc", "Merrell Nova 3", "Salomon XT 6", "Salomon Speedcross 6", "On Cloud 5",
    "On Cloudmonster", "On Cloudrunner", "Veja V-10", "Veja Campo", "Lotto Running Sneaker", "Sparx Mesh Sneaker",
    "Red Tape Casual Sneaker"
  ];

  const categories = [
    { name: 'Mobiles', image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Fashion', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Sneakers', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Electronics', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Appliances', image: 'https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Grocery', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Beauty', image: 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Home', image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Travel', image: 'https://images.pexels.com/photos/615060/pexels-photo-615060.jpeg?auto=compress&cs=tinysrgb&w=128' },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Toys', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=200' }
  ];

  const banners = [
    {
      id: 1,
      title: "End of Season Sale",
      subtitle: "Min 60% Off on Top Brands",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
      cta: "Shop Now",
      link: "/products?category=Fashion",
      color: "from-amber-900 to-black",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Smartphones & More",
      subtitle: "Latest Tech with No Cost EMI",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200",
      cta: "Grab Deals",
      link: "/products?category=Electronics",
      color: "from-indigo-950 to-amber-900",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Home Makeover",
      subtitle: "Up to 80% Off on Furniture",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
      cta: "Explore",
      link: "/products?category=Home",
      color: "from-slate-900 to-amber-950",
      textColor: "text-white"
    }
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        console.log("HOME DATA LOADED:", data);
        if (Array.isArray(data)) setLiveProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("HOME FETCH ERROR:", err);
        setIsLoading(false);
      });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const displayProducts = Array.isArray(liveProducts) && liveProducts.length > 0 ? liveProducts : products;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffbeb] flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-8 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="text-black font-black uppercase tracking-widest animate-pulse">Loading ApnaStore...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fffbeb] dark:bg-gray-950 min-h-screen pb-20 transition-colors duration-500">
      
      {/* Category Navigation Bar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md sticky top-0 z-40 border-b border-amber-100">
        <div className="max-w-[1400px] mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex justify-between items-center py-6 min-w-max gap-6 md:gap-8">
            {categories.map((cat) => (
              <div key={cat.name} className="relative group/cat">
                <Link 
                  to={`/products?category=${cat.name}`}
                  className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center p-2.5 bg-white rounded-[1.5rem] shadow-md border border-amber-50 group-hover:shadow-amber-200/50 transition-all">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'; // Fallback icon
                      }}
                    />
                  </div>
                  <span className="text-base font-black text-black group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>

                {/* Mega Menu for Fashion */}
                {cat.name === 'Fashion' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(219,39,119,0.2)] border-2 border-pink-50 dark:border-pink-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {FASHION_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-pink-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Electronics */}
                {cat.name === 'Electronics' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(245,158,11,0.2)] border-2 border-amber-50 dark:border-amber-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {ELECTRONICS_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-amber-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Appliances */}
                {cat.name === 'Appliances' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(37,99,235,0.2)] border-2 border-blue-50 dark:border-blue-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {APPLIANCES_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-blue-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Grocery */}
                {cat.name === 'Grocery' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(34,197,94,0.2)] border-2 border-green-50 dark:border-green-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {GROCERY_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-green-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Beauty */}
                {cat.name === 'Beauty' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(236,72,153,0.2)] border-2 border-pink-50 dark:border-pink-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {BEAUTY_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-pink-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Travel */}
                {cat.name === 'Travel' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(14,165,233,0.2)] border-2 border-sky-50 dark:border-sky-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {TRAVEL_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-sky-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Sports */}
                {cat.name === 'Sports' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(249,115,22,0.2)] border-2 border-orange-50 dark:border-orange-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {SPORTS_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-orange-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Toys */}
                {cat.name === 'Toys' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(168,85,247,0.2)] border-2 border-purple-50 dark:border-purple-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {TOYS_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-purple-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Sneakers */}
                {cat.name === 'Sneakers' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_80px_rgba(239,68,68,0.2)] border-2 border-red-50 dark:border-red-900/20 p-10 w-[800px] max-h-[500px] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                        {SNEAKERS_SUB.map(sub => (
                          <Link 
                            key={sub}
                            to={`/products?search=${encodeURIComponent(sub)}`}
                            className="text-xs font-black text-black/50 hover:text-red-600 uppercase tracking-widest transition-colors py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Slider */}
      <div className="max-w-[1400px] mx-auto px-6 mt-8">
        <div className="relative h-[350px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`absolute inset-0 bg-gradient-to-br ${banners[currentSlide].color} flex items-center`}
            >
              <div className="absolute inset-0 opacity-40">
                <img src={banners[currentSlide].image} alt="" className="w-full h-full object-cover mix-blend-overlay" />
              </div>
              <div className="relative z-10 px-10 md:px-24 max-w-3xl">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-5xl md:text-8xl font-black text-black mb-6 tracking-tighter drop-shadow-2xl`}
                >
                  {banners[currentSlide].title}
                </motion.h1>
                <motion.p 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.1 }}
                   className={`text-xl md:text-3xl text-black mb-10 font-bold`}
                >
                  {banners[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to={banners[currentSlide].link} className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black hover:bg-amber-50 transition-all shadow-2xl shadow-black/30 inline-flex items-center gap-3 text-lg">
                    {banners[currentSlide].cta} <ArrowRight size={24} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white/90 text-black p-5 rounded-[1.5rem] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white/90 text-black p-5 rounded-[1.5rem] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-xl"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-[1400px] mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Side: Trending & Offers */}
        <div className="lg:col-span-3 space-y-20">
          
          {/* Wishlist Section */}
          {wishlistItems.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500 p-3.5 rounded-[1.25rem] text-white shadow-xl shadow-red-200">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-black text-black uppercase tracking-tighter">Your Saved Items</h2>
                </div>
                <Link to="/wishlist" className="text-black font-black hover:translate-x-2 transition-transform flex items-center gap-2 text-base">
                  VIEW ALL <ArrowRight size={20} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {wishlistItems.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          {/* Trending Deals Section */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500 p-3.5 rounded-[1.25rem] text-white shadow-xl shadow-amber-200">
                  <TrendingUp size={24} />
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">Trending Deals</h2>
              </div>
              <Link to="/products" className="text-black font-black hover:translate-x-2 transition-transform flex items-center gap-2 text-base">
                VIEW ALL <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {displayProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Flash Sale Banner */}
          <section className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-amber-200/50">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                     <Zap className="fill-yellow-300 text-yellow-300 animate-pulse" size={32} />
                  </div>
                  <span className="text-base font-black uppercase tracking-[0.4em] text-black">Flash Sale</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-black">Golden Hours Sale!</h2>
                <p className="text-black mb-12 text-2xl max-w-lg font-bold">Shine bright with up to 90% off on premium collections.</p>
                <Link to="/products" className="bg-white text-black px-14 py-5 rounded-[1.5rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block text-lg">
                  SHOP THE SALE
                </Link>
             </div>
             <div className="absolute -right-20 -bottom-20 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-[100px]" />
             <ShoppingBag className="absolute -right-16 -top-16 w-80 h-80 opacity-10 rotate-12" />
          </section>

          {/* Best Offers Section */}
          <section>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 p-3.5 rounded-[1.25rem] text-white shadow-xl shadow-yellow-200">
                  <Gift size={24} />
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">Best Offers</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {displayProducts.slice(6, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Sidebar Features */}
        <div className="space-y-10">
          {/* Why ApnaStore */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl shadow-amber-200/40 border border-amber-50 dark:border-gray-800">
            <h3 className="text-xl font-black mb-10 text-black flex items-center gap-3 uppercase tracking-widest">
              <Star className="text-amber-500 fill-amber-500" size={24} /> Pure Apna
            </h3>
            <ul className="space-y-10">
               <li className="flex gap-5">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest text-black">Lightning Fast</h4>
                    <p className="text-xs text-black mt-2 uppercase font-bold">Same day delivery</p>
                  </div>
               </li>
               <li className="flex gap-5">
                  <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest text-black">Apna Assured</h4>
                    <p className="text-xs text-black mt-2 uppercase font-bold">100% genuine</p>
                  </div>
               </li>
            </ul>
          </div>

          {/* Best Rated Sidebar Widget */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-10 rounded-[3rem] border border-amber-100 relative overflow-hidden shadow-xl">
             <div className="relative z-10">
               <h3 className="text-xl font-black mb-8 text-black uppercase tracking-widest">Top Rated</h3>
               {displayProducts[0] && (
                 <div className="space-y-8">
                   <div className="aspect-square bg-white rounded-[2rem] overflow-hidden p-8 shadow-2xl shadow-amber-200/30">
                     <img src={displayProducts[0].image} alt="" className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2 text-amber-500 mb-3">
                       {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                     </div>
                     <h4 className="font-black text-base text-black line-clamp-2 leading-relaxed">{displayProducts[0].title}</h4>
                     <p className="text-black text-xs mt-3 mb-8 font-black uppercase tracking-widest">Loved by 10k+ users</p>
                     <Link to={`/product/${displayProducts[0].id}`} className="block text-center bg-amber-500 text-white py-5 rounded-[1.5rem] font-black text-sm shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95 uppercase tracking-widest">
                        SHOP NOW
                     </Link>
                   </div>
                 </div>
               )}
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl -mr-20 -mt-20" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
