const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

const IMAGES = {
    mobile: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    iphone: 'https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=400',
    laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    watch: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400',
    headphones: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    camera: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400',
    printer: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400',
    gaming: 'https://images.pexels.com/photos/2520856/pexels-photo-2520856.jpeg?auto=compress&cs=tinysrgb&w=400',
    monitor: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400',
    tablet: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
    tv: 'https://images.pexels.com/photos/5721865/pexels-photo-5721865.jpeg?auto=compress&cs=tinysrgb&w=400',
    speaker: 'https://images.pexels.com/photos/157534/pexels-photo-157534.jpeg?auto=compress&cs=tinysrgb&w=400',
    kitchen: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
    appliance: 'https://images.pexels.com/photos/3862369/pexels-photo-3862369.jpeg?auto=compress&cs=tinysrgb&w=400',
    tshirt: 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=400',
    shirt: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400',
    jeans: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
    saree: 'https://images.pexels.com/photos/1103828/pexels-photo-1103828.jpeg?auto=compress&cs=tinysrgb&w=400',
    furniture: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400',
    toys: 'https://images.pexels.com/photos/1619697/pexels-photo-1619697.jpeg?auto=compress&cs=tinysrgb&w=400'
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

const templates = [
    ...ELECTRONICS_SUB.map(sub => ({
        c: 'Electronics', s: sub, b: 'Apna Brand', t: `Premium ${sub}`, img: 
        sub.includes('Phone') ? IMAGES.mobile :
        sub.includes('Laptop') ? IMAGES.laptop :
        sub.includes('TV') ? IMAGES.tv :
        sub.includes('Speaker') || sub.includes('Ear') || sub.includes('Head') ? IMAGES.headphones :
        sub.includes('Camera') ? IMAGES.camera :
        sub.includes('Printer') ? IMAGES.printer :
        sub.includes('Watch') ? IMAGES.watch :
        sub.includes('Monitor') ? IMAGES.monitor :
        sub.includes('Keyboard') || sub.includes('Mouse') ? IMAGES.gaming :
        sub.includes('Fridge') || sub.includes('Refrigerator') || sub.includes('Washing') || sub.includes('AC') ? IMAGES.appliance :
        sub.includes('Cook') || sub.includes('Oven') || sub.includes('Grinder') ? IMAGES.kitchen :
        IMAGES.gaming
    })),
    ...APPLIANCES_SUB.map(sub => ({
        c: 'Appliances', s: sub, b: 'HomePro', t: `Premium ${sub}`, img:
        sub.includes('Fridge') || sub.includes('Refrigerator') ? IMAGES.appliance :
        sub.includes('Washing') || sub.includes('Washer') ? IMAGES.appliance :
        sub.includes('AC') || sub.includes('Conditioner') ? IMAGES.appliance :
        sub.includes('Cooler') || sub.includes('Fan') ? IMAGES.appliance :
        sub.includes('Heater') || sub.includes('Geyser') ? IMAGES.appliance :
        sub.includes('Purifier') || sub.includes('Dispenser') ? IMAGES.appliance :
        sub.includes('Oven') || sub.includes('Fryer') || sub.includes('Maker') || sub.includes('Cooker') || sub.includes('Kettle') ? IMAGES.kitchen :
        sub.includes('Mixer') || sub.includes('Grinder') || sub.includes('Blender') || sub.includes('Processor') || sub.includes('Chopper') ? IMAGES.kitchen :
        sub.includes('Iron') || sub.includes('Steamer') || sub.includes('Vacuum') || sub.includes('Cleaner') || sub.includes('Mop') || sub.includes('Scrubber') ? IMAGES.appliance :
        sub.includes('Dryer') || sub.includes('Straightener') || sub.includes('Curler') || sub.includes('Trimmer') || sub.includes('Shaver') || sub.includes('Groomer') || sub.includes('Epilator') ? IMAGES.appliance :
        IMAGES.appliance
    })),
    ...GROCERY_SUB.map(sub => ({
        c: 'Grocery', s: sub, b: 'FreshExpress', t: `${sub}`, img:
        sub.includes('Milk') || sub.includes('Curd') || sub.includes('Paneer') || sub.includes('Cheese') || sub.includes('Cream') ? 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Drink') || sub.includes('Juice') || sub.includes('Soda') || sub.includes('Water') ? 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Oil') || sub.includes('Ghee') || sub.includes('Butter') ? 'https://images.pexels.com/photos/3375997/pexels-photo-3375997.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Rice') || sub.includes('Flour') || sub.includes('Dal') || sub.includes('Sugar') || sub.includes('Salt') ? 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...BEAUTY_SUB.map(sub => ({
        c: 'Makeup', s: sub, b: 'EliteGlow', t: `Luxury ${sub}`, img:
        sub.includes('Lip') ? 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Face') || sub.includes('Cream') || sub.includes('Mask') ? 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Hair') || sub.includes('Shampoo') ? 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...TRAVEL_SUB.map(sub => ({
        c: 'Travel', s: sub, b: 'GlobeTrotter', t: `Pro ${sub}`, img:
        sub.includes('Bag') || sub.includes('Suitcase') || sub.includes('Luggage') ? 'https://images.pexels.com/photos/943150/pexels-photo-943150.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...SPORTS_SUB.map(sub => ({
        c: 'Sports', s: sub, b: 'ActiveX', t: `Pro ${sub}`, img:
        sub.includes('Ball') || sub.includes('Bat') || sub.includes('Racket') ? 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...TOYS_SUB.map(sub => ({
        c: 'Toys', s: sub, b: 'KidsZone', t: `Fun ${sub}`, img:
        sub.includes('Doll') || sub.includes('Teddy') || sub.includes('Stuffed') ? 'https://images.pexels.com/photos/1612447/pexels-photo-1612447.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Car') || sub.includes('Truck') || sub.includes('Toy') ? 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400'
    })),
    ...SNEAKERS_SUB.map(sub => ({
        c: 'Sneakers', s: sub, b: sub.split(' ')[0], t: `${sub} Professional Edition`, img:
        sub.includes('Nike') ? 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Adidas') ? 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...BOOKS_SUB.map(sub => ({
        c: 'Books', s: sub, b: 'EliteReads', t: `${sub} (Hardcover Edition)`, img:
        sub.includes('Math') || sub.includes('Science') || sub.includes('Code') || sub.includes('Programming') ? 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400' :
        'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    ...FASHION_SUB.map(sub => ({
        c: 'Fashion', s: sub, b: 'ApnaStyle', t: `Designer ${sub}`, img:
        sub.includes('T-Shirt') || sub.includes('Top') ? IMAGES.tshirt :
        sub.includes('Shirt') ? IMAGES.shirt :
        sub.includes('Jeans') || sub.includes('Pants') || sub.includes('Trousers') ? IMAGES.jeans :
        sub.includes('Saree') || sub.includes('Kurti') || sub.includes('Dress') ? IMAGES.saree :
        sub.includes('Shoes') || sub.includes('Sneakers') || sub.includes('Heels') || sub.includes('Boots') ? 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Bag') || sub.includes('Backpack') ? 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400' :
        sub.includes('Watch') ? IMAGES.watch :
        'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'
    })),
    { c: 'Home', s: 'Furniture', b: 'Flipkart', t: 'Modern Living Room Set', img: IMAGES.furniture },
];

const mobileNames = [
    "Apple iPhone 15", "Apple iPhone 15 Plus", "Apple iPhone 15 Pro", "Apple iPhone 15 Pro Max", "Apple iPhone 14", "Apple iPhone 14 Plus", "Apple iPhone 14 Pro", "Apple iPhone 14 Pro Max", "Apple iPhone 13", "Apple iPhone 13 Mini",
    "Samsung Galaxy S24", "Samsung Galaxy S24 Plus", "Samsung Galaxy S24 Ultra", "Samsung Galaxy S23", "Samsung Galaxy S23 FE", "Samsung Galaxy A55", "Samsung Galaxy A35", "Samsung Galaxy A25", "Samsung Galaxy M55", "Samsung Galaxy F54",
    "OnePlus 12", "OnePlus 12R", "OnePlus 11", "OnePlus Nord CE 4", "OnePlus Nord 3", "OnePlus Nord CE 3 Lite", "OnePlus Open", "OnePlus 10 Pro", "OnePlus 10R", "OnePlus Nord 2T",
    "Xiaomi 14", "Xiaomi 13 Pro", "Xiaomi Redmi Note 13", "Xiaomi Redmi Note 13 Pro", "Xiaomi Redmi Note 13 Pro Plus", "Xiaomi Redmi 13C", "Xiaomi Redmi A3", "Xiaomi Poco X6", "Xiaomi Poco X6 Pro", "Xiaomi Poco M6 Pro",
    "Realme 12 Pro", "Realme 12 Pro Plus", "Realme Narzo 70", "Realme Narzo 70 Pro", "Realme C67", "Realme C55", "Realme GT 6", "Realme GT Neo 5", "Realme 11 Pro", "Realme 11 Pro Plus",
    "Vivo V30", "Vivo V30 Pro", "Vivo T3", "Vivo T2 Pro", "Vivo Y200", "Vivo Y100", "Vivo X100", "Vivo X100 Pro", "Vivo V29", "Vivo Y36",
    "Oppo Reno 11", "Oppo Reno 11 Pro", "Oppo F25 Pro", "Oppo F23", "Oppo A79", "Oppo A59", "Oppo Find X7", "Oppo Find N3 Flip", "Oppo Reno 10", "Oppo A38",
    "Motorola Edge 50 Pro", "Motorola Edge 40", "Motorola Edge 40 Neo", "Motorola G84", "Motorola G73", "Motorola G54", "Motorola G34", "Motorola Razr 40", "Motorola Razr 50 Ultra", "Motorola Edge 30 Fusion",
    "Google Pixel 8", "Google Pixel 8 Pro", "Google Pixel 7", "Google Pixel 7a", "Google Pixel 6a", "Google Pixel Fold", "Google Pixel 9", "Google Pixel 9 Pro", "Google Pixel 8a", "Google Pixel 7 Pro",
    "Nothing Phone 1", "Nothing Phone 2", "Nothing Phone 2a", "Nothing Phone 3", "Nothing CMF Phone 1",
    "Asus ROG Phone 8", "Asus Zenfone 10", "Asus ROG Phone 7", "Asus Zenfone 9", "Asus ROG Phone 6",
    "iQOO 12", "iQOO Neo 9 Pro", "iQOO Z9", "iQOO Z7 Pro", "iQOO 11", "iQOO Neo 7", "iQOO Z6 Lite", "iQOO 9 SE", "iQOO Neo 6", "iQOO Z9x",
    "Lava Agni 2", "Lava Blaze 5G", "Lava Blaze Curve", "Lava Yuva 3", "Lava Storm 5G", "Lava O2", "Lava Blaze Pro", "Lava Z66", "Lava Agni 5G", "Lava Iris 88",
    "Infinix Zero 30", "Infinix GT 20 Pro", "Infinix Note 40", "Infinix Smart 8", "Infinix Hot 40", "Infinix Zero Ultra", "Infinix Note 30", "Infinix Hot 30", "Infinix Smart 7", "Infinix Zero 5G",
    "Tecno Camon 30", "Tecno Pova 6 Pro", "Tecno Spark 20", "Tecno Phantom V Fold", "Tecno Phantom V Flip", "Tecno Camon 20", "Tecno Pova 5", "Tecno Spark 10", "Tecno Pop 8", "Tecno Camon 19",
    "Nokia G42", "Nokia G21", "Nokia C32", "Nokia X30", "Nokia G60", "Nokia C22", "Nokia XR21", "Nokia G11 Plus", "Nokia C12", "Nokia 8.3 5G",
    "Sony Xperia 1 V", "Sony Xperia 5 V", "Sony Xperia 10 V", "Sony Xperia Pro I", "Sony Xperia 1 IV",
    "Huawei P60 Pro", "Huawei Mate 60 Pro", "Huawei Nova 12", "Huawei P50 Pro", "Huawei Mate X5",
    "Honor Magic 6 Pro", "Honor 90", "Honor X9b", "Honor Magic V2", "Honor 200 Pro",
    "Lenovo Legion Y90", "Lenovo K14 Plus", "ZTE Nubia Red Magic 9 Pro", "ZTE Axon 50 Ultra", "Meizu 21", "Meizu 20 Pro", "Black Shark 5 Pro",
    "Blackview BV9300", "Doogee S110", "Ulefone Armor 24", "Cat S62 Pro", "Fairphone 5",
    "Micromax In Note 2", "Micromax In 2c", "Karbonn Titanium S9",
    "Itel P55 5G", "Itel A70", "Itel S23 Plus", "Itel Vision 5", "Itel P40 Plus",
    "JioPhone Next", "Jio Bharat V2", "Jio Bharat B1", "Reliance LYF Water 11",
    "Panasonic Eluga Ray 810", "Panasonic Eluga I8", "Alcatel 3X", "Alcatel 1S", "Coolpad Cool 20", "Blu G91 Pro", "Blu Bold N3", "TCL 40 XL", "TCL 30 SE", "Sharp Aquos R8", "Sharp Aquos Sense 8"
];

const homeProductsList = [
    { name: "CozyNest Wooden Sofa Set", type: "Sofa", img: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "UrbanStyle Coffee Table", type: "Table", img: "https://images.pexels.com/photos/892601/pexels-photo-892601.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "DreamRest King Size Bed", type: "Bed", img: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ComfortSeat Recliner Chair", type: "Chair", img: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ModernEdge TV Unit", type: "Furniture", img: "https://images.pexels.com/photos/1571450/pexels-photo-1571450.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SpaceSaver Shoe Rack", type: "Furniture", img: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "RoyalWood Wardrobe", type: "Furniture", img: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SmartStudy Study Table", type: "Table", img: "https://images.pexels.com/photos/2097118/pexels-photo-2097118.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "DecorGlow Wall Clock", type: "Decor", img: "https://images.pexels.com/photos/210543/pexels-photo-210543.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ShineCraft Table Lamp", type: "Lighting", img: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "BrightHome Ceiling Light", type: "Lighting", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "CrystalAura Chandelier", type: "Lighting", img: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "GlowNest LED Strip Light", type: "Lighting", img: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "NightEase Bedside Lamp", type: "Lighting", img: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FreshLook Wall Mirror", type: "Decor", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Artify Canvas Wall Painting", type: "Decor", img: "https://images.pexels.com/photos/164005/pexels-photo-164005.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FrameMagic Photo Frame Set", type: "Decor", img: "https://images.pexels.com/photos/268488/pexels-photo-268488.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "GreenTouch Artificial Plant", type: "Decor", img: "https://images.pexels.com/photos/793012/pexels-photo-793012.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "AromaBliss Scented Candles", type: "Decor", img: "https://images.pexels.com/photos/604441/pexels-photo-604441.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "StyleVase Flower Vase", type: "Decor", img: "https://images.pexels.com/photos/892601/pexels-photo-892601.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SoftTouch Bedsheet Set", type: "Bedding", img: "https://images.pexels.com/photos/6580224/pexels-photo-6580224.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "DreamCloud Pillow Set", type: "Bedding", img: "https://images.pexels.com/photos/6580224/pexels-photo-6580224.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "CozyLayer Blanket", type: "Bedding", img: "https://images.pexels.com/photos/6580224/pexels-photo-6580224.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FreshHome Curtains", type: "Bedding", img: "https://images.pexels.com/photos/6580222/pexels-photo-6580222.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "LuxuryWeave Carpet", type: "Decor", img: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ComfortStep Door Mat", type: "Decor", img: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "PlushNest Cushion Covers", type: "Bedding", img: "https://images.pexels.com/photos/6580224/pexels-photo-6580224.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ElegantThrow Sofa Cover", type: "Bedding", img: "https://images.pexels.com/photos/6580222/pexels-photo-6580222.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "KitchenPro Storage Rack", type: "Kitchen", img: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SmartShelf Wall Shelf", type: "Kitchen", img: "https://images.pexels.com/photos/2097118/pexels-photo-2097118.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SpaceBox Organizer Basket", type: "Kitchen", img: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "TidyHome Drawer Organizer", type: "Kitchen", img: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FreshCook Spice Rack", type: "Kitchen", img: "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "DishDry Kitchen Rack", type: "Kitchen", img: "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "PureSteel Cutlery Stand", type: "Kitchen", img: "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "BathEase Shower Curtain", type: "Bath", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "MirrorGlow Bathroom Cabinet", type: "Bath", img: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SoapCare Dispenser Set", type: "Bath", img: "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "TowelMate Towel Stand", type: "Bath", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FreshBath Floor Mat", type: "Bath", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "GreenLeaf Plant Pot Set", type: "Outdoor", img: "https://images.pexels.com/photos/793012/pexels-photo-793012.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Balcony Chair Table", type: "Outdoor", img: "https://images.pexels.com/photos/2034330/pexels-photo-2034330.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "GardenGlow Outdoor Lights", type: "Outdoor", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "NatureNest Hanging Planter", type: "Outdoor", img: "https://images.pexels.com/photos/793012/pexels-photo-793012.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Folding Table", type: "Outdoor", img: "https://images.pexels.com/photos/2097118/pexels-photo-2097118.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Cooler Air Purifier", type: "Appliances", img: "https://images.pexels.com/photos/3862369/pexels-photo-3862369.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Cooler Breeze Tower Fan", type: "Appliances", img: "https://images.pexels.com/photos/5591607/pexels-photo-5591607.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SmartVac Vacuum Cleaner", type: "Appliances", img: "https://images.pexels.com/photos/38325/pexels-photo-38325.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "FreshMist Humidifier", type: "Appliances", img: "https://images.pexels.com/photos/5591607/pexels-photo-5591607.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "HomeSafe Digital Door Lock", type: "Appliances", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" }
];

const mobilesProductsList = mobileNames.map((name, i) => {
    const brand = name.split(' ')[0];
    let img = IMAGES.mobile;
    if (brand === 'Apple') img = IMAGES.iphone;
    if (brand === 'Samsung') img = 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400';
    if (brand === 'Google') img = 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400';
    if (['OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo'].includes(brand)) img = 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400';
    
    return { name, type: "Smartphone", brand, img };
});

const generateProducts = (count) => {
    const products = [];
    const timestamp = Date.now();

    // 1. Add User Requested Mobiles (200+)
    mobilesProductsList.forEach((item, i) => {
        const price = Math.floor(Math.random() * 80000) + 7000;
        const discount = Math.floor(Math.random() * 30) + 5;
        const originalPrice = Math.floor(price * (100 / (100 - discount)));

        products.push({
            id: `mob_spec_${i + 1}_${timestamp}`,
            title: item.name,
            description: `Latest ${item.name} with advanced features. Premium ${item.brand} quality smartphone with high-end camera and battery.`,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            rating: Number((Math.random() * 0.5 + 4.4).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 20000) + 1000,
            category: 'Mobiles',
            subcategory: 'Smartphones',
            brand: item.brand,
            image: item.img,
            images: [item.img, item.img],
            isAssured: true,
            sellerType: 'Flipkart Assured',
            isEcoFriendly: true,
            isBudgetFriendly: price < 15000,
            stock: 100,
            source: 'Flipkart',
            tags: ['mobiles', 'smartphones', item.brand.toLowerCase()]
        });
    });

    // 2. Add User Requested Home Items (50)
    homeProductsList.forEach((item, i) => {
        const price = Math.floor(Math.random() * 8000) + 199;
        const discount = Math.floor(Math.random() * 70) + 10;
        const originalPrice = Math.floor(price * (100 / (100 - discount)));

        products.push({
            id: `home_spec_${i + 1}_${timestamp}`,
            title: item.name,
            description: `Premium ${item.name} for your home makeover. High quality ${item.type} with elegant design. Eco-friendly material.`,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            rating: 5.0,
            reviewCount: Math.floor(Math.random() * 5000) + 500,
            category: 'Home',
            subcategory: item.type,
            brand: 'Flipkart',
            image: item.img,
            images: [item.img, item.img],
            isAssured: true,
            sellerType: 'Flipkart Assured',
            isEcoFriendly: true,
            isBudgetFriendly: true,
            stock: 50,
            source: 'Flipkart',
            tags: ['home', 'furniture', item.type.toLowerCase()]
        });
    });

    const allTemplates = [...templates];
    const remainingCount = count - products.length;
    for (let i = 0; i < remainingCount; i++) {
        const template = allTemplates[i % allTemplates.length];
        const price = Math.floor(Math.random() * 8500) + 199;
        const discount = Math.floor(Math.random() * 60) + 10;
        const originalPrice = Math.floor(price * (100 / (100 - discount)));

        products.push({
            id: `prod_gen_${i + 1}_${timestamp}`,
            title: `${template.b} ${template.t}`,
            description: `Budget Friendly ${template.s} from ${template.b}. Eco-friendly and durable material.`,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            rating: Number((Math.random() * 2 + 3).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 10000),
            category: template.c,
            subcategory: template.s,
            brand: template.b,
            image: template.img,
            images: [template.img, template.img],
            isAssured: Math.random() > 0.3,
            sellerType: 'Flipkart Assured',
            isEcoFriendly: true,
            isBudgetFriendly: true,
            stock: 50,
            source: 'Flipkart',
            tags: [template.c.toLowerCase(), template.s.toLowerCase(), 'budget', 'eco-friendly']
        });
    }

    return products;
};

(async () => {
    try {
        console.log(`[Seed V3] Connecting to MongoDB: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        
        console.log('[Seed V3] Wiping old products...');
        await Product.deleteMany({});
        
        const targetCount = 2000;
        console.log(`[Seed V3] Generating ${targetCount} products with 200+ Mobiles and 50 Home items...`);
        const products = generateProducts(targetCount);
        
        console.log('[Seed V3] Bulk inserting into database...');
        await Product.insertMany(products);
        
        console.log(`✅ MISSION SUCCESS! Seeded ${products.length} products with complete mobile database.`);
        process.exit(0);
    } catch (err) {
        console.error('[Seed V3] ERROR:', err);
        process.exit(1);
    }
})();
