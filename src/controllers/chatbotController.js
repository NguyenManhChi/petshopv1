const { query } = require('../../config/database');
const axios = require('axios');

// Use Gemini AI via REST API (more compatible)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// AI-powered product search based on natural language description
const searchProducts = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mô tả sản phẩm bạn muốn tìm',
      });
    }

    const lowerMessage = message.toLowerCase();
    
    // Phát hiện yêu cầu về giá TRƯỚC KHI gọi AI
    let priceIntent = null;
    let priceRange = null;
    
    // Phát hiện khoảng giá cụ thể
    const pricePatterns = [
      { regex: /dưới\s*(\d+)k?/i, type: 'max' },
      { regex: /dưới\s*(\d+)\.?(\d+)?k?/i, type: 'max' },
      { regex: /trên\s*(\d+)k?/i, type: 'min' },
      { regex: /trên\s*(\d+)\.?(\d+)?k?/i, type: 'min' },
      { regex: /từ\s*(\d+)k?\s*(đến|-)\s*(\d+)k?/i, type: 'range' },
      { regex: /(\d+)k?\s*(đến|-)\s*(\d+)k?/i, type: 'range' },
      { regex: /khoảng\s*(\d+)k?/i, type: 'around' },
    ];

    for (const pattern of pricePatterns) {
      const match = message.match(pattern.regex);
      if (match) {
        if (pattern.type === 'max') {
          const amount = parseInt(match[1]);
          priceRange = { max: amount < 1000 ? amount * 1000 : amount };
        } else if (pattern.type === 'min') {
          const amount = parseInt(match[1]);
          priceRange = { min: amount < 1000 ? amount * 1000 : amount };
        } else if (pattern.type === 'range') {
          const min = parseInt(match[1]);
          const max = parseInt(match[3] || match[2]);
          priceRange = {
            min: min < 1000 ? min * 1000 : min,
            max: max < 1000 ? max * 1000 : max
          };
        } else if (pattern.type === 'around') {
          const amount = parseInt(match[1]);
          const base = amount < 1000 ? amount * 1000 : amount;
          priceRange = {
            min: base * 0.8,
            max: base * 1.2
          };
        }
        break;
      }
    }
    
    if (/(giá rẻ|rẻ nhất|thấp nhất|tiết kiệm|giá tốt|giá thấp|phải chăng|bình dân)/i.test(message)) {
      priceIntent = 'cheap';
    } else if (/(giá cao|đắt nhất|cao cấp|sang trọng|chất lượng cao|premium)/i.test(message)) {
      priceIntent = 'expensive';
    } else if (/(trung bình|vừa phải|tầm trung)/i.test(message)) {
      priceIntent = 'medium';
    }

    // Nếu hỏi về GIÁ hoặc KHOẢNG GIÁ → BỎ QUA AI, trả về trực tiếp
    if (priceIntent || priceRange) {
      console.log(`💰 Phát hiện yêu cầu về giá: ${priceIntent || 'range'}`, priceRange);
      
      let priceQuery = `
        SELECT 
          p.*,
          b.name as brand_name,
          c.category_name,
          pv.price,
          pv.discount_amount,
          pv.in_stock,
          pi.value as image_url,
          (pv.price - COALESCE(pv.discount_amount, 0)) as final_price
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN LATERAL (
          SELECT value FROM product_imgs 
          WHERE product_id = p.id 
          LIMIT 1
        ) pi ON true
        WHERE pv.in_stock > 0
      `;

      const queryParams = [];
      
      // Thêm điều kiện khoảng giá
      if (priceRange) {
        if (priceRange.min && priceRange.max) {
          priceQuery += ` AND (pv.price - COALESCE(pv.discount_amount, 0)) BETWEEN $1 AND $2`;
          queryParams.push(priceRange.min, priceRange.max);
        } else if (priceRange.max) {
          priceQuery += ` AND (pv.price - COALESCE(pv.discount_amount, 0)) <= $1`;
          queryParams.push(priceRange.max);
        } else if (priceRange.min) {
          priceQuery += ` AND (pv.price - COALESCE(pv.discount_amount, 0)) >= $1`;
          queryParams.push(priceRange.min);
        }
      }

      priceQuery += `
        GROUP BY p.id, b.name, c.category_name, pv.price, pv.discount_amount, pv.in_stock, pi.value, final_price
      `;

      if (priceIntent === 'cheap') {
        priceQuery += ' ORDER BY final_price ASC LIMIT 3';
      } else if (priceIntent === 'expensive') {
        priceQuery += ' ORDER BY final_price DESC LIMIT 3';
      } else if (priceIntent === 'medium') {
        priceQuery += ' ORDER BY final_price ASC';
      } else {
        // Nếu chỉ có khoảng giá, sắp xếp theo giá tăng dần
        priceQuery += ' ORDER BY final_price ASC LIMIT 10';
      }

      let priceProducts = await query(priceQuery, queryParams);
      
      // Nếu là medium, lấy sản phẩm ở giữa
      if (priceIntent === 'medium') {
        const total = priceProducts.rows.length;
        const start = Math.floor(total * 0.3);
        const end = Math.floor(total * 0.7);
        priceProducts.rows = priceProducts.rows.slice(start, end).slice(0, 3);
      }

      let responseMessage = '';
      if (priceIntent === 'cheap') {
        responseMessage = '💰 Dạ đây là các sản phẩm có giá tốt nhất của shop ạ!';
      } else if (priceIntent === 'expensive') {
        responseMessage = '✨ Dạ đây là các sản phẩm cao cấp nhất của shop ạ!';
      } else if (priceIntent === 'medium') {
        responseMessage = '📊 Dạ đây là các sản phẩm ở mức giá trung bình ạ!';
      } else if (priceRange) {
        if (priceRange.min && priceRange.max) {
          responseMessage = `💵 Dạ đây là các sản phẩm từ ${(priceRange.min/1000).toFixed(0)}k đến ${(priceRange.max/1000).toFixed(0)}k ạ!`;
        } else if (priceRange.max) {
          responseMessage = `💵 Dạ đây là các sản phẩm dưới ${(priceRange.max/1000).toFixed(0)}k ạ!`;
        } else if (priceRange.min) {
          responseMessage = `💵 Dạ đây là các sản phẩm trên ${(priceRange.min/1000).toFixed(0)}k ạ!`;
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          message: responseMessage,
          products: priceProducts.rows,
          suggestions: ['Thức ăn cho chó', 'Thức ăn cho mèo', 'Đồ chơi thú cưng'],
        },
      });
    }

    // Step 1: Get all available products for AI context (with price info)
    const allProductsQuery = `
      SELECT 
        p.id,
        p.product_name,
        p.product_description,
        p.product_short_description,
        b.name as brand_name,
        c.category_name,
        c.category_type,
        MIN(pv.price - COALESCE(pv.discount_amount, 0)) as min_price,
        MAX(pv.price - COALESCE(pv.discount_amount, 0)) as max_price
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY p.id, p.product_name, p.product_description, p.product_short_description, b.name, c.category_name, c.category_type
      LIMIT 50
    `;
    
    const allProducts = await query(allProductsQuery, []);

    // Step 2: Use Gemini AI to understand user intent and find relevant products
    const productContext = allProducts.rows
      .map(
        p =>
          `ID: ${p.id} | Tên: ${p.product_name} | Loại: ${p.category_type || 'N/A'} | Giá: ${Math.round(p.min_price)}₫ - ${Math.round(p.max_price)}₫ | Mô tả: ${p.product_short_description || 'N/A'}`
      )
      .join('\n');

    const aiPrompt = `Bạn là AI trợ lý cửa hàng thú cưng. Phân tích yêu cầu và TÌM sản phẩm.

SẢN PHẨM CÓ SẴN:
${productContext}

KHÁCH HỎI: "${message}"

Trả về JSON:
{
  "productIds": [id1, id2, id3],
  "message": "trả lời thân thiện",
  "sortBy": "price_asc hoặc price_desc"
}

QUY TẮC:
- "rẻ/thấp/tiết kiệm/tốt" → Chọn 5 ID GIÁ THẤP nhất, sortBy: "price_asc"
- "đắt/cao/sang/chất lượng" → Chọn 5 ID GIÁ CAO nhất, sortBy: "price_desc"
- "trung bình/vừa phải" → Chọn 5 ID ở KHOẢNG GIỮA, sortBy: "price_asc"
- Không nhắc giá → Chọn 5 ID phù hợp, sortBy: "price_asc"

CHÚ Ý: LUÔN chọn productIds, KHÔNG BAO GIỜ để trống []!`;

    // Call Gemini AI via REST API
    let aiData;
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [{ text: aiPrompt }],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse AI response
      const cleanResponse = aiResponse
        .replace(/```json\n?|\n?```/g, '')
        .trim();
      aiData = JSON.parse(cleanResponse);
      
      console.log('✅ AI Response:', aiData.message);
    } catch (error) {
      console.error('AI Error:', error.message);
      // Fallback to keyword search
      return fallbackKeywordSearch(message, req, res, next);
    }

    // Step 3: Extract price filter and sort option from AI response
    const priceFilter = aiData.priceFilter || null;
    const sortBy = aiData.sortBy || 'price_asc'; // Mặc định giá thấp

    // Step 4: Get full product details for selected IDs with price filtering
    if (aiData.productIds && aiData.productIds.length > 0) {
      let productDetailsQuery = `
        SELECT 
          p.*,
          b.name as brand_name,
          c.category_name,
          pv.price,
          pv.discount_amount,
          pv.in_stock,
          pi.value as image_url,
          (pv.price - COALESCE(pv.discount_amount, 0)) as final_price
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN LATERAL (
          SELECT value FROM product_imgs 
          WHERE product_id = p.id 
          LIMIT 1
        ) pi ON true
        WHERE p.id = ANY($1)
      `;

      const queryParams = [aiData.productIds];
      
      // Add price filtering if specified
      if (priceFilter) {
        if (priceFilter.min !== undefined) {
          queryParams.push(priceFilter.min);
          productDetailsQuery += ` AND (pv.price - COALESCE(pv.discount_amount, 0)) >= $${queryParams.length}`;
        }
        if (priceFilter.max !== undefined) {
          queryParams.push(priceFilter.max);
          productDetailsQuery += ` AND (pv.price - COALESCE(pv.discount_amount, 0)) <= $${queryParams.length}`;
        }
      }

      // Add sorting based on AI recommendation
      productDetailsQuery += `
        GROUP BY p.id, b.name, c.category_name, pv.price, pv.discount_amount, pv.in_stock, pi.value, final_price
      `;

      if (sortBy === 'price_asc') {
        productDetailsQuery += ' ORDER BY final_price ASC';
      } else if (sortBy === 'price_desc') {
        productDetailsQuery += ' ORDER BY final_price DESC';
      } else {
        productDetailsQuery += ' ORDER BY p.product_avg_rating DESC, final_price ASC';
      }

      const productDetails = await query(productDetailsQuery, queryParams);

      return res.status(200).json({
        success: true,
        data: {
          message: aiData.message,
          products: productDetails.rows,
          suggestions: aiData.suggestions || [],
        },
      });
    } else {
      // AI không trả về productIds → Fallback lấy 5 sản phẩm giá rẻ nhất
      console.log('⚠️ AI không trả productIds, fallback lấy sản phẩm giá rẻ');
      
      const cheapProductsQuery = `
        SELECT 
          p.*,
          b.name as brand_name,
          c.category_name,
          pv.price,
          pv.discount_amount,
          pv.in_stock,
          pi.value as image_url,
          (pv.price - COALESCE(pv.discount_amount, 0)) as final_price
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN LATERAL (
          SELECT value FROM product_imgs 
          WHERE product_id = p.id 
          LIMIT 1
        ) pi ON true
        WHERE pv.in_stock > 0
        GROUP BY p.id, b.name, c.category_name, pv.price, pv.discount_amount, pv.in_stock, pi.value, final_price
        ORDER BY final_price ASC
        LIMIT 5
      `;
      
      const cheapProducts = await query(cheapProductsQuery, []);
      
      return res.status(200).json({
        success: true,
        data: {
          message: aiData.message || 'Dạ, đây là các sản phẩm có giá tốt nhất của shop ạ! 😊',
          products: cheapProducts.rows,
          suggestions: aiData.suggestions || [
            'Thức ăn cho chó giá rẻ',
            'Thức ăn cho mèo giá rẻ',
            'Sản phẩm khuyến mãi',
          ],
        },
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    // Fallback to keyword search on error
    return fallbackKeywordSearch(req.body.message, req, res, next);
  }
};

// Fallback keyword search when AI fails
async function fallbackKeywordSearch(message, req, res, next) {
  try {
    const keywords = extractKeywords(message.toLowerCase());
    
    // Better categorization for dog/cat
    const isDog = /chó|dog|cún|puppy/i.test(message);
    const isCat = /mèo|cat|kitten/i.test(message);

    let searchQuery = `
      SELECT 
        p.*,
        b.name as brand_name,
        c.category_name,
        c.category_type,
        pv.price,
        pv.discount_amount,
        pv.in_stock,
        pi.value as image_url
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN LATERAL (
        SELECT value FROM product_imgs 
        WHERE product_id = p.id 
        LIMIT 1
      ) pi ON true
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 0;

    // Filter by pet type if clearly specified
    if (isDog && !isCat) {
      paramCount++;
      searchQuery += ` AND (LOWER(c.category_type) LIKE $${paramCount} OR LOWER(c.category_name) LIKE $${paramCount} OR LOWER(p.product_name) LIKE $${paramCount})`;
      queryParams.push('%chó%');
    } else if (isCat && !isDog) {
      paramCount++;
      searchQuery += ` AND (LOWER(c.category_type) LIKE $${paramCount} OR LOWER(c.category_name) LIKE $${paramCount} OR LOWER(p.product_name) LIKE $${paramCount})`;
      queryParams.push('%mèo%');
    }

    // Add keyword search
    if (keywords.length > 0) {
      const conditions = keywords.map(() => {
        paramCount++;
        return `(
          LOWER(p.product_name) LIKE $${paramCount} OR 
          LOWER(p.product_description) LIKE $${paramCount} OR
          LOWER(c.category_name) LIKE $${paramCount}
        )`;
      });

      searchQuery += ` AND (${conditions.join(' OR ')})`;
      keywords.forEach(keyword => {
        queryParams.push(`%${keyword}%`);
      });
    }

    searchQuery += ` 
      GROUP BY p.id, b.name, c.category_name, c.category_type, pv.price, pv.discount_amount, pv.in_stock, pi.value
      ORDER BY p.product_avg_rating DESC
      LIMIT 10
    `;

    const result = await query(searchQuery, queryParams);

    return res.status(200).json({
      success: true,
      data: {
        message:
          result.rows.length > 0
            ? `Tôi tìm thấy ${result.rows.length} sản phẩm phù hợp!`
            : 'Xin lỗi, không tìm thấy sản phẩm phù hợp.',
        products: result.rows,
        suggestions: [
          'Thức ăn cho chó',
          'Thức ăn cho mèo',
          'Đồ chơi thú cưng',
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

// Extract keywords from user message
function extractKeywords(message) {
  // Common Vietnamese stop words
  const stopWords = [
    'tôi',
    'muốn',
    'cần',
    'tìm',
    'mua',
    'có',
    'được',
    'cho',
    'của',
    'một',
    'các',
    'này',
    'đó',
    'và',
    'hoặc',
    'với',
    'để',
    'thì',
    'là',
    'sản phẩm',
    'giúp',
    'em',
    'anh',
    'chị',
  ];

  // Split message into words and filter
  const words = message
    .toLowerCase()
    .replace(/[^\w\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  return [...new Set(words)]; // Remove duplicates
}

// Generate AI-like response
function generateAIResponse(message, products) {
  const keywords = extractKeywords(message);
  let responseMessage = '';
  let suggestions = [];

  if (products.length === 0) {
    responseMessage = `Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với "${message}". Bạn có thể thử tìm kiếm với từ khóa khác không?`;
    suggestions = [
      'Thức ăn cho chó',
      'Thức ăn cho mèo',
      'Đồ chơi thú cưng',
      'Phụ kiện thú cưng',
    ];
  } else if (products.length === 1) {
    responseMessage = `Tôi tìm thấy 1 sản phẩm phù hợp với yêu cầu của bạn!`;
  } else {
    responseMessage = `Tôi tìm thấy ${products.length} sản phẩm phù hợp với "${keywords.join(', ')}" cho bạn!`;
  }

  return {
    message: responseMessage,
    suggestions,
  };
}

// Get popular products for initial suggestions
const getPopularProducts = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT 
        p.*,
        b.name as brand_name,
        c.category_name,
        pv.price,
        pv.discount_amount,
        pi.value as image_url
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN LATERAL (
        SELECT value FROM product_imgs 
        WHERE product_id = p.id 
        LIMIT 1
      ) pi ON true
      ORDER BY p.product_sold_quantity DESC, p.product_avg_rating DESC
      LIMIT 5
    `,
      []
    );

    return res.status(200).json({
      success: true,
      data: {
        message: 'Xin chào! Tôi có thể giúp bạn tìm sản phẩm gì hôm nay?',
        products: result.rows,
        suggestions: [
          'Thức ăn cho chó',
          'Thức ăn cho mèo',
          'Đồ chơi thú cưng',
          'Phụ kiện thú cưng',
          'Sản phẩm chăm sóc',
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchProducts,
  getPopularProducts,
};
