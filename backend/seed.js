const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

const P = [
// HOME
{c:'Home',s:'Bedsheets',b:'Bombay Dyeing',t:'Premium Cotton Double Bedsheet',tg:['bedsheet','cotton','bedroom','linen','home'],img:'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Home',s:'Flower Pots',b:'CraftDecor',t:'Ceramic Flower Pot Medium',tg:['flower pot','ceramic','garden','planter','decor'],img:'https://images.pexels.com/photos/2085351/pexels-photo-2085351.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Home',s:'Home Decor',b:'ExclusiveLane',t:'Handcrafted Wooden Table Lamp',tg:['lamp','table lamp','decor','wood','light'],img:'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Home',s:'Bottles & Tiffin',b:'Milton',t:'Stainless Steel Water Bottle 1L',tg:['bottle','water bottle','steel','milton','tiffin'],img:'https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Home',s:'Kitchen',b:'Prestige',t:'Non-Stick Cookware Set 3pc',tg:['cookware','kitchen','non-stick','pan','kadai'],img:'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=400'},
// GROCERY
{c:'Grocery',s:'Rice',b:'India Gate',t:'Premium Basmati Rice 5kg',tg:['rice','basmati','grain','chawal'],img:'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Grocery',s:'Pulses',b:'Tata Sampann',t:'Premium Toor Dal 1kg',tg:['dal','toor','pulse','lentil','grocery'],img:'https://images.pexels.com/photos/4033636/pexels-photo-4033636.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Grocery',s:'Spices',b:'Everest',t:'Turmeric Haldi Powder 200g',tg:['haldi','turmeric','spice','masala'],img:'https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Grocery',s:'Oil',b:'Fortune',t:'Sunflower Refined Oil 2L',tg:['oil','cooking oil','fortune','grocery'],img:'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=400'},
// FASHION - Women
{c:'Fashion',s:'Western Wear',b:'Zara',t:'Women Western Stylish Crop Top',tg:['women','top','crop top','western','fashion'],img:'https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Fashion',s:'Ethnic Wear',b:'Biba',t:'Women Embroidered Kurti',tg:['women','kurti','ethnic','indian','suit'],img:'https://images.pexels.com/photos/2995309/pexels-photo-2995309.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Fashion',s:'Ethnic Wear',b:'FabIndia',t:'Women Premium Silk Saree',tg:['women','saree','silk','ethnic','traditional'],img:'https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=400'},
// FASHION - Men
{c:'Fashion',s:'Western Wear',b:'Allen Solly',t:'Men Slim Fit Formal Shirt',tg:['men','shirt','formal','office','fashion'],img:'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Fashion',s:'Western Wear',b:'US Polo',t:'Men Casual Polo T-Shirt',tg:['men','tshirt','polo','casual'],img:'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Fashion',s:'Winter Wear',b:'Wildcraft',t:'Men Winter Puffer Jacket',tg:['men','jacket','winter','puffer'],img:'https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg?auto=compress&cs=tinysrgb&w=400'},
// SHOES
{c:'Fashion',s:'Footwear',b:'Nike',t:'Nike Air Max Running Shoes Men',tg:['shoes','running','nike','sneakers','footwear'],img:'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Fashion',s:'Footwear',b:'Adidas',t:'Adidas Ultraboost Sneakers Men',tg:['shoes','sneakers','adidas','sports'],img:'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=400'},
// APPLIANCES
{c:'Appliances',s:'Refrigerator',b:'LG',t:'LG 655L Side-by-Side Refrigerator',tg:['fridge','refrigerator','LG','appliances'],img:'https://images.pexels.com/photos/3862369/pexels-photo-3862369.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Appliances',s:'Washing Machine',b:'Samsung',t:'Samsung 8kg Front Load Washing Machine',tg:['washing machine','samsung','laundry'],img:'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=400'},
// MOBILES
{c:'Mobiles',s:'Smartphone',b:'Apple',t:'iPhone 15 Pro 256GB Titanium',tg:['iphone','apple','smartphone','mobile','ios'],img:'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/thumbnail.png'},
{c:'Mobiles',s:'Smartphone',b:'Samsung',t:'Samsung Galaxy S24 Ultra 512GB',tg:['samsung','galaxy','smartphone','mobile','android'],img:'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S21/thumbnail.png'},
// BEAUTY
{c:'Beauty',s:'Makeup',b:'MAC',t:'MAC Ruby Woo Matte Lipstick',tg:['lipstick','MAC','makeup','beauty'],img:'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400'},
// STATIONARY & TOYS
{c:'Toys',s:'Educational',b:'Funskool',t:'Building Blocks 100 Pieces Set',tg:['toys','blocks','kids','educational'],img:'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?auto=compress&cs=tinysrgb&w=400'},
{c:'Books',s:'Self Help',b:'Penguin',t:'Atomic Habits by James Clear',tg:['book','self help','habits','reading'],img:'https://images.pexels.com/photos/1749071/pexels-photo-1749071.jpeg?auto=compress&cs=tinysrgb&w=400'},
];

const gen=(count)=>Array.from({length:count}).map((_,i)=>{
  const tp=P[i%P.length];
  const isBudget=Math.random()<0.3;
  const price=isBudget?Math.floor(Math.random()*400)+99:Math.floor(Math.random()*40000)+500;
  const discount=Math.floor(Math.random()*40)+10;
  const isLocal=Math.random()<0.2;
  
  // Make title slightly unique by appending a variant
  const variants = [' (Black)', ' (Blue)', ' (Premium)', ' (New)', ' (Red)', ' Edition 2026', ' Pro'];
  const variant = variants[i % variants.length];
  
  return {
    id:`prod_${i+1}_${Date.now()}`,
    title:tp.t + (i % 3 === 0 ? variant : ''),
    description:`${tp.t} - Best quality ${tp.s} from ${tp.b}. Designed for premium performance and durability.`,
    price,originalPrice:Math.floor(price*(100/(100-discount))),discount,
    rating:Number((Math.random()*1.5+3.5).toFixed(1)), // Higher ratings for better look
    reviewCount:Math.floor(Math.random()*10000)+100,
    category:tp.c,subcategory:tp.s,brand:tp.b,image:tp.img,images:[tp.img],
    isAssured:Math.random() > 0.2,
    sellerType:isLocal?'Local Business':'Flipkart Assured',
    isEcoFriendly:Math.random()<0.2,isBudgetFriendly:price<500,
    tags: [...tp.tg, tp.b.toLowerCase(), tp.s.toLowerCase(), tp.c.toLowerCase(), 'available', 'best price']
  };
});

(async()=>{
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB. Cleaning old products...');
    await Product.deleteMany({});
    
    // Generating 1200 products for massive search coverage
    const data=gen(1200);
    await Product.insertMany(data);
    
    console.log(`✅ Success! Seeded ${data.length} products.`);
    console.log(`Your "ApnaStore" now has more products than a typical demo!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
