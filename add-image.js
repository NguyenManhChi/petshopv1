const { query } = require('./config/database');

async function addImage() {
  try {
    // Add image
    const result = await query(
      'INSERT INTO product_imgs (product_id, name, value, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [1, 'main_image', 'https://img.meta.com.vn/Data/image/2021/09/22/anh-meo-cute-de-thuong-dang-yeu-42.jpg']
    );
    console.log('✅ Image added:', result.rows[0]);
    
    // Verify
    const verify = await query(
      `SELECT p.id, p.product_name,
              (SELECT json_agg(json_build_object('id', pi.id, 'name', pi.name, 'value', pi.value))
               FROM product_imgs pi WHERE pi.product_id = p.id) as images
       FROM products p WHERE p.id = 1`
    );
    console.log('\n✅ Product now has images:');
    console.log(JSON.stringify(verify.rows[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addImage();
