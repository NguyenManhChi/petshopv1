const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyB2cmBq2jouOUjd5C-9gmUOeClnXyhMO_o';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Cache kết quả phân tích (TTL: 1 giờ)
let analysisCache = null;
let cacheTime = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 giờ

// Hàm xóa cache phân tích (gọi khi có review mới/sửa/xóa)
const invalidateAnalysisCache = () => {
  analysisCache = null;
  cacheTime = null;
  console.log('🔄 Cache phân tích đã được xóa - sẽ phân tích lại ở lần gọi tiếp theo');
};

// Create new review
const createReview = asyncHandler(async (req, res) => {
  const { product_id, product_variant_id, rating, review_text } = req.body;
  const user_id = req.user.id;

  const review = await Review.create({
    product_id,
    product_variant_id,
    user_id,
    rating,
    review_text,
  });

  // Xóa cache phân tích để tự động phân tích lại ở lần gọi tiếp theo
  invalidateAnalysisCache();

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review },
  });
});

// Get reviews by product ID
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await Review.getByProductId(
    productId,
    parseInt(page),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: result,
  });
});

// Get review by ID
const getReviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  res.json({
    success: true,
    data: { review },
  });
});

// Update review
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review_text } = req.body;
  const user_id = req.user.id;

  const review = await Review.update(id, user_id, {
    rating,
    review_text,
  });

  // Xóa cache phân tích để tự động phân tích lại ở lần gọi tiếp theo
  invalidateAnalysisCache();

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: { review },
  });
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const review = await Review.delete(id, user_id);

  // Xóa cache phân tích để tự động phân tích lại ở lần gọi tiếp theo
  invalidateAnalysisCache();

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// Get user's reviews
const getUserReviews = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const result = await Review.getByUserId(
    user_id,
    parseInt(page),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: result,
  });
});

// Get all reviews (admin only)
const getAllReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    product_id,
    rating,
    search,
    sort_by = 'created_at',
    sort_order = 'DESC',
  } = req.query;

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    product_id: product_id ? parseInt(product_id) : undefined,
    rating: rating ? parseInt(rating) : undefined,
    search,
    sort_by,
    sort_order,
  };

  const result = await Review.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// Delete review (admin only)
const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.delete(id, null, true);

  // Xóa cache phân tích để tự động phân tích lại ở lần gọi tiếp theo
  invalidateAnalysisCache();

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// Get recent reviews
const getRecentReviews = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const reviews = await Review.getRecent(parseInt(limit));

  res.json({
    success: true,
    data: { reviews },
  });
});

// Get review statistics
const getReviewStatistics = asyncHandler(async (req, res) => {
  const statistics = await Review.getStatistics();

  res.json({
    success: true,
    data: { statistics },
  });
});

// Get reviews by rating
const getReviewsByRating = asyncHandler(async (req, res) => {
  const { rating } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (![1, 2, 3, 4, 5].includes(parseInt(rating))) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5',
    });
  }

  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    rating: parseInt(rating),
  };

  const result = await Review.getAll(filters);

  res.json({
    success: true,
    data: result,
  });
});

// AI Analysis of all reviews
const analyzeReviews = asyncHandler(async (req, res) => {
  console.log('🎯 analyzeReviews được gọi!');
  console.log('📝 Request method:', req.method);
  console.log('👤 User:', req.user);
  console.log('🔍 Query params:', req.query);
  
  // Kiểm tra cache (nếu chưa quá 5 phút)
  if (analysisCache && cacheTime && (Date.now() - cacheTime < CACHE_TTL)) {
    console.log('✅ Trả về kết quả từ cache');
    return res.json({
      success: true,
      data: {
        ...analysisCache,
        fromCache: true,
      },
    });
  }

  console.log('🔄 Đang phân tích reviews mới...');

  // Lấy tất cả reviews từ DB
  const result = await Review.getAll({ limit: 1000 });
  const reviews = result.reviews;

  if (!reviews || reviews.length === 0) {
    return res.json({
      success: true,
      data: {
        summary: 'Chưa có review nào để phân tích',
        totalReviews: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 },
        keywords: [],
        insights: [],
      },
    });
  }

  // Chuẩn bị dữ liệu cho AI
  const reviewsText = reviews.map((r, idx) => 
    `Review ${idx + 1}: ${r.rating}⭐ - "${r.review_text}" (Sản phẩm: ${r.product_name})`
  ).join('\n');

  const aiPrompt = `Bạn là chuyên gia phân tích đánh giá khách hàng của cửa hàng thú cưng.

NHIỆM VỤ: Phân tích ${reviews.length} reviews sau và trả về JSON với cấu trúc:

{
  "summary": "Tóm tắt tổng quan về đánh giá (2-3 câu)",
  "sentiment": {
    "positive": <số phần trăm reviews tích cực>,
    "neutral": <số phần trăm reviews trung lập>,
    "negative": <số phần trăm reviews tiêu cực>
  },
  "keywords": [
    {"word": "từ khóa", "count": <số lần xuất hiện>, "sentiment": "positive/negative/neutral"},
    ...top 10 từ khóa
  ],
  "insights": [
    "Điểm mạnh 1",
    "Điểm mạnh 2",
    "Vấn đề cần cải thiện 1",
    "Vấn đề cần cải thiện 2"
  ],
  "recommendedActions": [
    "Hành động đề xuất 1",
    "Hành động đề xuất 2"
  ]
}

REVIEWS:
${reviewsText}

CHÚ Ý: 
- Phân tích sentiment dựa trên rating và nội dung
- Tìm từ khóa về sản phẩm, dịch vụ, chất lượng
- Đưa ra insights thực tế, hữu ích
- CHỈ trả về JSON, KHÔNG thêm text nào khác`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: aiPrompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('AI không trả về JSON hợp lệ');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    const finalData = {
      ...analysis,
      totalReviews: reviews.length,
      averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      analyzedAt: new Date().toISOString(),
    };

    // Lưu vào cache
    analysisCache = finalData;
    cacheTime = Date.now();
    console.log('✅ Đã lưu kết quả vào cache');

    res.json({
      success: true,
      data: finalData,
    });

  } catch (error) {
    console.error('❌ AI Analysis Error:', error.message);
    
    // Fallback analysis đơn giản nếu AI fail
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const positive = reviews.filter(r => r.rating >= 4).length;
    const neutral = reviews.filter(r => r.rating === 3).length;
    const negative = reviews.filter(r => r.rating <= 2).length;

    res.json({
      success: true,
      data: {
        summary: `Đã phân tích ${reviews.length} reviews với đánh giá trung bình ${avgRating.toFixed(1)}/5 sao`,
        totalReviews: reviews.length,
        averageRating: avgRating.toFixed(1),
        sentiment: {
          positive: ((positive / reviews.length) * 100).toFixed(0),
          neutral: ((neutral / reviews.length) * 100).toFixed(0),
          negative: ((negative / reviews.length) * 100).toFixed(0),
        },
        keywords: [],
        insights: ['Phân tích AI tạm thời không khả dụng'],
        recommendedActions: [],
        analyzedAt: new Date().toISOString(),
      },
    });
  }
});

module.exports = {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserReviews,
  getAllReviews,
  deleteReviewAdmin,
  getRecentReviews,
  analyzeReviews,
  getReviewStatistics,
  getReviewsByRating,
};
