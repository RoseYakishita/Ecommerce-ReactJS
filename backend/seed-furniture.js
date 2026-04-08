const mysql = require('mysql2/promise');

const productsData = [
  // Liviing Room
  { name: 'Modern Leather Sofa', price: 899.99, desc: 'A sleek, modern leather sofa perfect for contemporary living rooms.', categoryId: 1, stock: 15, dimensions: '84" W x 35" D x 34" H', material: 'Genuine Leather, Hardwood Frame', colors: '["Black", "Brown", "White"]' },
  { name: 'Minimalist Sectional', price: 1250.00, desc: 'Comfortable minimalist sectional sofa with plush cushions.', categoryId: 1, stock: 8, dimensions: '110" W x 60" D x 32" H', material: 'Linen Fabric, Metal Legs', colors: '["Grey", "Beige", "Navy"]' },
  { name: 'Velvet Armchair', price: 450.00, desc: 'Elegant velvet armchair to add a touch of luxury to your space.', categoryId: 1, stock: 20, dimensions: '30" W x 32" D x 38" H', material: 'Velvet, Walnut', colors: '["Emerald Green", "Royal Blue", "Mustard"]' },
  { name: 'Glass Coffee Table', price: 299.99, desc: 'Round glass coffee table with a geometric gold base.', categoryId: 1, stock: 25, dimensions: '36" D x 18" H', material: 'Tempered Glass, Brass', colors: '["Gold", "Rose Gold"]' },
  { name: 'Mid-Century TV Stand', price: 349.50, desc: 'Wooden TV stand featuring sliding slatted doors.', categoryId: 1, stock: 12, dimensions: '60" W x 16" D x 20" H', material: 'MDF, Pine Veneer', colors: '["Walnut", "Acorn"]' },
  { name: 'Cozy Bean Bag Chair', price: 120.00, desc: 'Oversized bean bag chair for ultimate relaxation.', categoryId: 1, stock: 30, dimensions: '40" W x 40" D x 30" H', material: 'Faux Fur', colors: '["Charcoal", "Cream", "Pink"]' },
  { name: 'Classic Wooden Bookshelf', price: 410.00, desc: 'Tall 5-tier bookshelf with solid wood construction.', categoryId: 1, stock: 18, dimensions: '32" W x 14" D x 72" H', material: 'Solid Oak', colors: '["Oak", "Espresso"]' },
  { name: 'L-Shaped Couch', price: 1100.00, desc: 'Spacious L-shaped couch perfect for family movie nights.', categoryId: 1, stock: 5, dimensions: '105" W x 85" D x 35" H', material: 'Polyester Blend', colors: '["Dark Grey", "Oatmeal"]' },
  { name: 'Industrial End Table', price: 150.00, desc: 'Small end table combining metal pipes and reclaimed wood.', categoryId: 1, stock: 40, dimensions: '18" W x 18" D x 22" H', material: 'Reclaimed Wood, Iron', colors: '["Rust", "Black"]' },
  { name: 'Boho Rattan Chair', price: 210.00, desc: 'Handwoven rattan chair bringing a breezy coastal vibe.', categoryId: 1, stock: 15, dimensions: '28" W x 29" D x 34" H', material: 'Natural Rattan', colors: '["Natural", "White"]' },

  // Bedroom
  { name: 'Upholstered Platform Bed', price: 799.00, desc: 'Queen size platform bed with a tufted headboard.', categoryId: 2, stock: 10, dimensions: '64" W x 84" L x 48" H', material: 'Linen, Pine Wood', colors: '["Stone", "Charcoal"]' },
  { name: 'Solid Wood Nightstand', price: 189.99, desc: 'Two-drawer nightstand with brass handles.', categoryId: 2, stock: 35, dimensions: '22" W x 16" D x 24" H', material: 'Solid Pine, Brass', colors: '["Cherry", "White", "Navy"]' },
  { name: 'Farmhouse Dresser', price: 499.50, desc: 'Wide 6-drawer dresser offering ample storage.', categoryId: 2, stock: 12, dimensions: '58" W x 18" D x 34" H', material: 'Oak Veneer', colors: '["Rustic Oak", "Whitewash"]' },
  { name: 'Memory Foam Mattress (Queen)', price: 550.00, desc: '12-inch cooling gel memory foam mattress.', categoryId: 2, stock: 25, dimensions: '60" W x 80" L x 12" H', material: 'Memory Foam', colors: '["White"]' },
  { name: 'Spindle Bed Frame', price: 850.00, desc: 'Vintage-inspired wooden bed frame with spindle headboard.', categoryId: 2, stock: 8, dimensions: '63" W x 82" L x 42" H', material: 'Solid Rubberwood', colors: '["Walnut", "Black"]' },
  { name: 'Mirrored Wardrobe', price: 620.00, desc: 'Contemporary wardrobe featuring mirrored doors to expand the room.', categoryId: 2, stock: 7, dimensions: '40" W x 22" D x 78" H', material: 'Engineered Wood, Glass', colors: '["White", "Silver"]' },
  { name: 'Minimalist Vanity Desk', price: 299.00, desc: 'Compact vanity desk with a flip-top mirror.', categoryId: 2, stock: 14, dimensions: '36" W x 18" D x 30" H', material: 'MDF, Metal', colors: '["White/Gold", "Black/Gold"]' },
  { name: 'Plush Bench', price: 210.00, desc: 'Elegant end-of-bed bench with velvet upholstery.', categoryId: 2, stock: 20, dimensions: '48" W x 16" D x 18" H', material: 'Velvet, Gold-finish steel', colors: '["Blush Pink", "Emerald"]' },
  { name: 'Bunk Bed with Storage', price: 890.00, desc: 'Twin-over-twin bunk bed featuring built-in storage drawers.', categoryId: 2, stock: 5, dimensions: '42" W x 78" L x 65" H', material: 'Solid Pine', colors: '["Espresso", "White"]' },
  { name: 'Rolling Clothing Rack', price: 95.00, desc: 'Industrial-style rolling clothing rack with a bottom shelf.', categoryId: 2, stock: 45, dimensions: '35" W x 17" D x 65" H', material: 'Steel pipe, Wood shelf', colors: '["Black/Rustic"]' },

  // Dining Room
  { name: 'Extendable Dining Table', price: 950.00, desc: 'Large dining table that extends to seat 8 people comfortably.', categoryId: 3, stock: 6, dimensions: '72-96" W x 40" D x 30" H', material: 'Solid Walnut', colors: '["Walnut"]' },
  { name: 'Faux Leather Dining Chair', price: 145.00, desc: 'Comfortable dining chair with easy-to-clean faux leather.', categoryId: 3, stock: 60, dimensions: '20" W x 24" D x 34" H', material: 'PU Leather, Metal', colors: '["Tan", "Black", "Grey"]' },
  { name: 'Round Marble Table', price: 680.00, desc: 'Small round dining table featuring a faux marble top.', categoryId: 3, stock: 10, dimensions: '48" D x 30" H', material: 'Faux Marble, Brass frame', colors: '["White/Gold"]' },
  { name: 'Rattan Back Dining Chair (Set of 2)', price: 320.00, desc: 'Set of two dining chairs with woven rattan backs.', categoryId: 3, stock: 25, dimensions: '19" W x 21" D x 33" H', material: 'Ash wood, Rattan', colors: '["Natural", "Black"]' },
  { name: 'Rustic Wooden Buffet', price: 740.00, desc: 'Spacious buffet sideboard perfect for storing dishes.', categoryId: 3, stock: 8, dimensions: '60" W x 18" D x 34" H', material: 'Reclaimed Pine', colors: '["Barnwood"]' },
  { name: 'Bar Stools (Set of 2)', price: 210.00, desc: 'Upholstered bar stools with footrests, ideal for kitchen islands.', categoryId: 3, stock: 30, dimensions: '18" W x 20" D x 40" H', material: 'Linen, Steel', colors: '["Grey", "Blue"]' },
  { name: 'Glass Display Cabinet', price: 590.00, desc: 'Tall cabinet with glass doors to showcase fine china.', categoryId: 3, stock: 5, dimensions: '36" W x 16" D x 70" H', material: 'MDF, Tempered Glass', colors: '["White", "Navy"]' },
  { name: 'Modern Dining Bench', price: 180.00, desc: 'Sleek wooden bench providing flexible dining seating.', categoryId: 3, stock: 15, dimensions: '60" W x 14" D x 18" H', material: 'Solid Oak', colors: '["Light Oak"]' },
  { name: 'Drop-Leaf Table', price: 340.00, desc: 'Space-saving drop-leaf table for small dining areas.', categoryId: 3, stock: 12, dimensions: '30-48" W x 30" D x 30" H', material: 'Rubberwood', colors: '["White/Natural"]' },
  { name: 'Metal Cafe Chair', price: 85.00, desc: 'Stackable metal cafe chair offering an industrial look.', categoryId: 3, stock: 80, dimensions: '17" W x 17" D x 33" H', material: 'Powder-coated Steel', colors: '["Yellow", "Mint", "Black"]' },

  // Office
  { name: 'Ergonomic Office Chair', price: 350.00, desc: 'High-back ergonomic chair with lumbar support and mesh back.', categoryId: 4, stock: 40, dimensions: '26" W x 26" D x 45-50" H', material: 'Mesh, Plastic, Aluminum', colors: '["Black", "Grey"]' },
  { name: 'Electric Standing Desk', price: 499.00, desc: 'Height-adjustable standing desk with presets.', categoryId: 4, stock: 20, dimensions: '55" W x 28" D x 28-46" H', material: 'Laminate top, Steel frame', colors: '["White", "Walnut/Black"]' },
  { name: 'L-Shaped Corner Desk', price: 275.00, desc: 'Spacious corner desk maximizing workspace.', categoryId: 4, stock: 18, dimensions: '60" W (both sides) x 24" D x 30" H', material: 'Engineered Wood, Metal', colors: '["Rustic Brown", "Black"]' },
  { name: 'Filing Cabinet', price: 155.00, desc: '3-drawer locking metal filing cabinet on wheels.', categoryId: 4, stock: 25, dimensions: '15" W x 20" D x 24" H', material: 'Steel', colors: '["White", "Charcoal"]' },
  { name: 'Leather Executive Chair', price: 420.00, desc: 'Plush leather executive chair for ultimate comfort.', categoryId: 4, stock: 12, dimensions: '28" W x 30" D x 42" H', material: 'Genuine Leather, Chrome', colors: '["Brown", "Black"]' },
  { name: 'Ladder Bookshelf', price: 130.00, desc: 'Leaning ladder-style bookshelf for office decor.', categoryId: 4, stock: 35, dimensions: '24" W x 18" D x 72" H', material: 'MDF, Pine', colors: '["White", "Espresso"]' },
  { name: 'Drafting Table', price: 290.00, desc: 'Adjustable angle drafting table for creative work.', categoryId: 4, stock: 10, dimensions: '40" W x 24" D x 30-40" H', material: 'Tempered Glass, Steel', colors: '["Silver/Clear"]' },
  { name: 'Printer Cart', price: 85.00, desc: 'Two-tier rolling cart designed specifically for printers.', categoryId: 4, stock: 45, dimensions: '20" W x 16" D x 25" H', material: 'Particleboard, Steel', colors: '["Black"]' },
  { name: 'Small Writing Desk', price: 140.00, desc: 'Compact writing desk with a single pull-out drawer.', categoryId: 4, stock: 20, dimensions: '42" W x 20" D x 30" H', material: 'Rubberwood', colors: '["Natural", "White"]' },
  { name: 'Acoustic Room Divider', price: 210.00, desc: 'Freestanding acoustic divider to reduce office noise.', categoryId: 4, stock: 8, dimensions: '60" W x 1.5" D x 65" H', material: 'Recycled PET fiber', colors: '["Grey", "Navy"]' },

  // Outdoor
  { name: 'Patio Wicker Sofa Set', price: 850.00, desc: '4-piece outdoor wicker sofa set with water-resistant cushions.', categoryId: 5, stock: 10, dimensions: 'Varies by piece', material: 'PE Rattan, Steel, Polyester', colors: '["Brown/Beige", "Grey/Grey"]' },
  { name: 'Teak Adirondack Chair', price: 295.00, desc: 'Classic wooden Adirondack chair built for the outdoors.', categoryId: 5, stock: 30, dimensions: '30" W x 36" D x 38" H', material: 'Solid Teak Wood', colors: '["Natural Teak"]' },
  { name: 'Outdoor Dining Set', price: 1200.00, desc: '7-piece aluminum dining set resistant to rust.', categoryId: 5, stock: 5, dimensions: 'Table: 70" W x 40" D', material: 'Cast Aluminum', colors: '["Bronze", "Black"]' },
  { name: 'Hanging Egg Chair', price: 340.00, desc: 'Comfortable swinging egg chair with a sturdy stand.', categoryId: 5, stock: 12, dimensions: 'Stand: 40" D x 78" H', material: 'Steel, PE Wicker, Olefin', colors: '["Grey", "White"]' },
  { name: 'Concrete Fire Pit', price: 580.00, desc: 'Propane fire pit table offering warmth and ambiance.', categoryId: 5, stock: 8, dimensions: '42" W x 20" D x 16" H', material: 'Glass-fiber reinforced concrete', colors: '["Grey"]' },
  { name: 'Market Umbrella', price: 120.00, desc: '9ft patio umbrella with crank lift and tilt.', categoryId: 5, stock: 40, dimensions: '108" D x 96" H', material: 'Aluminum, Polyester', colors: '["Navy", "Red", "Tan"]' },
  { name: 'Folding Chaise Lounge', price: 199.00, desc: 'Adjustable poolside chaise lounge chair.', categoryId: 5, stock: 25, dimensions: '26" W x 78" L x 12" H', material: 'Acacia Wood', colors: '["Natural"]' },
  { name: 'Outdoor Storage Deck Box', price: 155.00, desc: 'Waterproof deck box for storing patio cushions.', categoryId: 5, stock: 18, dimensions: '48" W x 24" D x 24" H', material: 'Resin', colors: '["Mocha", "Light Grey"]' },
  { name: 'Ceramic Garden Stool', price: 75.00, desc: 'Decorative waterproof stool that doubles as an end table.', categoryId: 5, stock: 35, dimensions: '13" D x 18" H', material: 'Ceramic', colors: '["Teal", "White", "Yellow"]' },
  { name: 'Hammock with Stand', price: 165.00, desc: 'Quilted fabric hammock including a heavy-duty steel stand.', categoryId: 5, stock: 20, dimensions: 'Stand: 110" L x 40" W', material: 'Cotton blend, Steel', colors: '["Striped Blue", "Solid Sand"]' },
];

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'rose',
      password: '33213',
      database: 'ecom_DB'
    });

    console.log("Connected to DB. Keeping existing products, appending 50 new detailed products...");
    
    // Seed Categories to resolve foreign key constraints
    const categories = [
      { id: 1, name: 'Living Room', description: 'Furniture for the living area' },
      { id: 2, name: 'Bedroom', description: 'Furniture for the bedroom' },
      { id: 3, name: 'Dining Room', description: 'Furniture for dining and kitchen' },
      { id: 4, name: 'Office', description: 'Furniture for home office' },
      { id: 5, name: 'Outdoor', description: 'Furniture for patio and outdoors' },
    ];
    for (const c of categories) {
      await conn.execute('INSERT IGNORE INTO `categories` (id, name, description) VALUES (?, ?, ?)', [c.id, c.name, c.description]);
    }

    console.log("Seeding 50 furniture products...");

    let count = 0;
    for (const p of productsData) {
      const images = JSON.stringify([
        `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`
      ]);
      await conn.execute(
        'INSERT INTO `products` (name, price, description, categoryId, stock, dimensions, material, colors, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.price, p.desc, p.categoryId, p.stock, p.dimensions, p.material, p.colors, images]
      );
      count++;
    }

    console.log(`Successfully seeded ${count} products with advanced attributes!`);
    await conn.end();
    process.exit();
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
