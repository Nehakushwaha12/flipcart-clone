import { Product } from '../types';

const IMAGES = {
    iphone: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=400',
    laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    shoes: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    top: 'https://images.pexels.com/photos/10101735/pexels-photo-10101735.jpeg?auto=compress&cs=tinysrgb&w=400',
    fridge: 'https://images.pexels.com/photos/3862369/pexels-photo-3862369.jpeg?auto=compress&cs=tinysrgb&w=400',
    table: 'https://images.pexels.com/photos/2097118/pexels-photo-2097118.jpeg?auto=compress&cs=tinysrgb&w=400',
    smartphone: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400'
};

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

const BOOKS_SUB = [
    "Novel Book", "Story Book", "Poetry Book", "Drama Book", "Romance Novel", "Thriller Novel",
    "Mystery Book", "Horror Book", "Fantasy Book", "Adventure Book", "Science Fiction Book",
    "Historical Fiction Book", "Biography Book", "Autobiography Book", "Memoir Book", "Self Help Book",
    "Motivation Book", "Personality Development Book", "Business Book", "Finance Book", "Investment Guide Book",
    "Marketing Book", "Startup Guide Book", "Leadership Book", "Productivity Book", "Psychology Book",
    "Philosophy Book", "Spiritual Book", "Religion Book", "Meditation Book", "Health Book", "Fitness Book",
    "Yoga Book", "Diet Book", "Cooking Book", "Recipe Book", "Travel Guide Book", "Language Learning Book",
    "Dictionary Book", "Encyclopedia Book", "General Knowledge Book", "Quiz Book", "Puzzle Book",
    "Sudoku Book", "Coloring Book", "Comic Book", "Manga Book", "Graphic Novel", "Children Story Book",
    "Bedtime Story Book", "Nursery Rhymes Book", "Alphabet Learning Book", "Activity Book", "Sticker Book",
    "Drawing Book", "Educational Book", "School Textbook", "Math Book", "Science Book", "Physics Book",
    "Chemistry Book", "Biology Book", "History Book", "Geography Book", "Civics Book", "Economics Book",
    "Political Science Book", "Computer Science Book", "Coding Book", "Programming Book", "Java Book",
    "Python Book", "C++ Book", "Web Development Book", "Data Science Book", "Artificial Intelligence Book",
    "Machine Learning Book", "Engineering Book", "Medical Book", "Law Book", "Nursing Book",
    "Architecture Book", "Design Book", "Photography Book", "Art Book", "Music Theory Book",
    "Guitar Learning Book", "Dance Guide Book", "Fashion Design Book", "Interior Design Book",
    "Gardening Book", "Parenting Book", "Relationship Book", "Pet Care Book", "Astrology Book",
    "Exam Preparation Book", "Competitive Exam Book", "Current Affairs Book", "Yearbook", "Journal Notebook"
];

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

const T = [
  ...ELECTRONICS_SUB.map(sub => ({
      c: 'Electronics', s: sub, b: 'Apna Brand', t: `Premium ${sub}`, img: IMAGES.smartphone
  })),
  ...APPLIANCES_SUB.map(sub => ({
      c: 'Appliances', s: sub, b: 'HomePro', t: `Premium ${sub}`, img: IMAGES.fridge
  })),
  ...GROCERY_SUB.map(sub => ({
      c: 'Grocery', s: sub, b: 'FreshExpress', t: `${sub}`, img: IMAGES.smartphone
  })),
  ...BEAUTY_SUB.map(sub => ({
      c: 'Beauty', s: sub, b: 'EliteGlow', t: `Luxury ${sub}`, img: IMAGES.top
  })),
  ...TRAVEL_SUB.map(sub => ({
      c: 'Travel', s: sub, b: 'GlobeTrotter', t: `Pro ${sub}`, img: IMAGES.shoes
  })),
  ...SPORTS_SUB.map(sub => ({
      c: 'Sports', s: sub, b: 'ActiveX', t: `Pro ${sub}`, img: IMAGES.shoes
  })),
  ...TOYS_SUB.map(sub => ({
      c: 'Toys', s: sub, b: 'KidsZone', t: `Fun ${sub}`, img: IMAGES.shoes
  })),
  ...SNEAKERS_SUB.map(sub => ({
      c: 'Sneakers', s: sub, b: sub.split(' ')[0], t: `${sub} Edition`, img: IMAGES.shoes
  })),
  ...BOOKS_SUB.map(sub => ({
      c: 'Books', s: sub, b: 'EliteReads', t: `${sub}`, img: IMAGES.top
  })),
  ...FASHION_SUB.map(sub => ({
      c: 'Fashion', s: sub, b: 'ApnaStyle', t: `Designer ${sub}`, img: IMAGES.top
  })),
  { c: 'Fashion', s: 'Footwear', b: 'Flipkart', t: 'Running Shoes', img: IMAGES.shoes },
  { c: 'Fashion', s: 'Clothing', b: 'Flipkart', t: 'Women Designer Top', img: IMAGES.top },
  { c: 'Home', s: 'Furniture', b: 'Flipkart', t: 'Modern Study Table', img: IMAGES.table },
  { c: 'Appliances', s: 'Fridge', b: 'Flipkart', t: 'Double Door Fridge', img: IMAGES.fridge },
];

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, index) => {
    const tp = T[index % T.length];
    const price = Math.floor(Math.random() * 49900) + 100;
    const discount = Math.floor(Math.random() * 40) + 5;
    const originalPrice = Math.floor(price * (100 / (100 - discount)));

    return {
      id: index + 1,
      title: `${tp.b} ${tp.t}`,
      description: `Premium ${tp.t} from ${tp.b}. High durability and quality.`,
      price,
      originalPrice,
      discount,
      rating: Number((Math.random() * 0.5 + 4.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 15000),
      category: tp.c,
      brand: tp.b,
      image: tp.img,
      images: [tp.img, tp.img],
      isAssured: true,
      stock: Math.floor(Math.random() * 20) + 5, // Random stock between 5 and 25
    };
  });
};

export const products: Product[] = generateProducts(2000);

export const categories = [
  { name: 'Mobiles', img: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Fashion', img: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Electronics', img: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Home', img: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Appliances', img: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Grocery', img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Beauty', img: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Books', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200' },
  { name: 'Sneakers', img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Travel', img: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200' },
  { name: 'Toys', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=200' },
];

export const getProductById = (id: number | string) => products.find((p) => String(p.id) === String(id));
