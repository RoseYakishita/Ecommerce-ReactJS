const mysql = require('mysql2/promise');

(async () => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'rose',
        password: '33213',
        database: 'ecom_DB'
    });

    try {
        console.log("Seeding rich visual furniture data...");
        await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
        await conn.execute('DELETE FROM `product_variants`');
        await conn.execute('DELETE FROM `cart_items`');
        await conn.execute('DELETE FROM `products`');
        await conn.execute('SET FOREIGN_KEY_CHECKS = 1');

        const products = [
            {
                name: "Bộ Bàn Ăn Gỗ Sồi Modern",
                price: 12500000,
                description: "Bộ bàn ăn cao cấp phong cách Bắc Âu, bền bỉ và tinh tế.",
                categoryId: 3,
                stock: 20,
                colors: JSON.stringify([
                    { name: "Nâu", hex: "#634439" },
                    { name: "Kem", hex: "#dec19e" }
                ]),
                specifications: JSON.stringify([
                    { key: "Bàn ăn", value: "Dài 125cm x Rộng 75cm x Cao 74cm" },
                    { key: "Ghế ăn ODESSA", value: "Dài 43cm x Rộng 51cm x Cao 92cm" },
                    { key: "Mặt bàn", value: "Gỗ công nghiệp PB chuẩn CARB-P2, Veneer gỗ sồi tự nhiên" },
                    { key: "Chân bàn", value: "Gỗ cao su tự nhiên" },
                    { key: "Lưu ý", value: "(*) Tiêu chuẩn California Air Resources Board xuất khẩu Mỹ" }
                ]),
                variants: [
                    { name: "4 Ghế FYN", priceAdjustment: 0, stock: 5 },
                    { name: "4 Ghế MILAN", priceAdjustment: 1200000, stock: 5 },
                    { name: "4 Ghế OSLO", priceAdjustment: 800000, stock: 5 },
                    { name: "4 Ghế MALAGA", priceAdjustment: 1500000, stock: 5 }
                ]
            }
        ];

        for (const p of products) {
            const [result] = await conn.execute(
                'INSERT INTO `products` (name, price, description, categoryId, stock, colors, specifications, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.price, p.description, p.categoryId, p.stock, p.colors, p.specifications, JSON.stringify(["https://images.unsplash.com/photo-1577145946459-a7647248039c?auto=format&fit=crop&q=80&w=800"])]
            );
            const productId = result.insertId;

            for (const v of p.variants) {
                await conn.execute(
                    'INSERT INTO `product_variants` (name, priceAdjustment, stock, productId) VALUES (?, ?, ?, ?)',
                    [v.name, v.priceAdjustment, v.stock, productId]
                );
            }
        }

        console.log("Successfully seeded rich product with variants!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
