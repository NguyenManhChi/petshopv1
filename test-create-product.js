const { query, getClient } = require('./config/database');

async function testCreateProduct() {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Create product
    const productResult = await client.query(
      `INSERT INTO products (product_name, product_slug, product_buy_price, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      ['Test Product with Images', 'test-product-with-images', 50000]
    );
    
    const product = productResult.rows[0];
    console.log('Product created:', product);
    
    // Insert images
    const images = [
      { name: 'Dog Image', value: 'https://img.lovepik.com/background/20211030/medium/lovepik-dog-phone-wallpaper-background-image_400484175.jpg' }
    ];
    
    for (const image of images) {
      const imgResult = await client.query(
        'INSERT INTO product_imgs (product_id, name, value, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [product.id, image.name, image.value]
      );
      console.log('Image inserted:', imgResult.rows[0]);
    }
    
    await client.query('COMMIT');
    console.log('\n✅ Product created successfully with images!');
    console.log('Product ID:', product.id);
    
    // Verify
    const verifyResult = await query(
      `SELECT p.id, p.product_name,
              (SELECT json_agg(json_build_object('id', pi.id, 'name', pi.name, 'value', pi.value))
               FROM product_imgs pi WHERE pi.product_id = p.id) as images
       FROM products p WHERE p.id = $1`,
      [product.id]
    );
    
    console.log('\nVerification:', JSON.stringify(verifyResult.rows[0], null, 2));
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

testCreateProduct();
