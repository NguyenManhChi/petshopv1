// Script phân tích reviews bằng AI Gemini và lưu kết quả
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyB2cmBq2jouOUjd5C-9gmUOeClnXyhMO_o';
const API_BASE_URL = 'http://localhost:3000/api';

// Hàm phân tích thông minh dựa trên reviews thật
function smartAnalyze(reviews) {
  const sentimentWords = {
    positive: ['tốt', 'đẹp', 'chất lượng', 'hài lòng', 'tuyệt', 'ok', 'ngon', 'dễ thương', 'đáng yêu', 'thích', 'nhanh', 'ổn'],
    negative: ['không tốt', 'tệ', 'kém', 'thất vọng', 'chậm', 'xấu', 'hỏng', 'không đúng', 'lỗi', 'giả']
  };

  let positive = 0, neutral = 0, negative = 0;
  const keywordCount = {};
  const issues = [];
  const strengths = [];

  reviews.forEach(review => {
    const text = review.review_text.toLowerCase();
    const rating = review.rating;

    // Phân loại sentiment
    const hasPositive = sentimentWords.positive.some(w => text.includes(w));
    const hasNegative = sentimentWords.negative.some(w => text.includes(w));

    if (rating >= 4 && hasPositive) {
      positive++;
      if (text.includes('chất lượng')) strengths.push(`Sản phẩm ${review.product_name} được đánh giá cao về chất lượng`);
      if (text.includes('giao hàng') || text.includes('nhanh')) strengths.push('Giao hàng nhanh chóng');
    } else if (rating <= 2 || hasNegative) {
      negative++;
      if (text.includes('giao hàng')) issues.push('Một số khách hàng phàn nàn về giao hàng');
      if (text.includes('sản phẩm')) issues.push('Có vấn đề về chất lượng sản phẩm');
    } else {
      neutral++;
    }

    // Đếm từ khóa
    const words = text.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      if (!['của', 'và', 'cho', 'với', 'được', 'đã', 'rất', 'này', 'đây'].includes(word)) {
        keywordCount[word] = (keywordCount[word] || 0) + 1;
      }
    });
  });

  // Top keywords
  const topKeywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      sentiment: sentimentWords.positive.includes(word) ? 'positive' : 
                sentimentWords.negative.includes(word) ? 'negative' : 'neutral'
    }));

  const total = reviews.length;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  return {
    summary: `Phân tích ${total} đánh giá từ khách hàng với điểm trung bình ${avgRating}/5. ` +
             `${Math.round(positive/total*100)}% khách hàng hài lòng, ` +
             `${Math.round(negative/total*100)}% chưa hài lòng.`,
    totalReviews: total,
    averageRating: avgRating,
    sentiment: {
      positive: Math.round(positive/total*100).toString(),
      neutral: Math.round(neutral/total*100).toString(),
      negative: Math.round(negative/total*100).toString()
    },
    keywords: topKeywords,
    insights: [
      ...new Set([...strengths.slice(0, 3), ...issues.slice(0, 2)])
    ],
    recommendedActions: [
      negative > total*0.2 ? 'Cải thiện quy trình kiểm soát chất lượng sản phẩm' : 'Duy trì chất lượng sản phẩm hiện tại',
      positive > total*0.6 ? 'Tăng cường marketing với feedback tích cực' : 'Khảo sát thêm để hiểu nhu cầu khách hàng',
      'Phản hồi nhanh các đánh giá tiêu cực'
    ],
    analyzedAt: new Date().toISOString()
  };
}

async function analyzeReviews() {
  try {
    console.log('🤖 Bắt đầu phân tích reviews bằng AI...\n');

    // Lấy tất cả reviews
    console.log('📥 Đang lấy reviews từ database...');
    const reviewsResponse = await axios.get(`${API_BASE_URL}/reviews/recent?limit=100`);
    const reviews = reviewsResponse.data.data.reviews;

    if (!reviews || reviews.length === 0) {
      console.log('⚠️ Không có review nào để phân tích!');
      return;
    }

    console.log(`✅ Đã lấy ${reviews.length} reviews\n`);

    // Chuẩn bị prompt cho AI
    const reviewsText = reviews.slice(0, 50).map((r, idx) => 
      `Review ${idx + 1}: ${r.rating}⭐ - "${r.review_text}"`
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
    ...top 8 từ khóa
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

CHÚ Ý: CHỈ trả về JSON, KHÔNG thêm text nào khác`;

    console.log('🧠 Đang gửi dữ liệu cho AI Gemini phân tích...');
    
    // Gọi Gemini AI
    const aiResponse = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: aiPrompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const aiText = aiResponse.data.candidates[0].content.parts[0].text;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('AI không trả về JSON hợp lệ');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    const finalData = {
      ...analysis,
      totalReviews: reviews.length,
      averageRating: avgRating,
      analyzedAt: new Date().toISOString(),
    };

    // Lưu vào file JSON
    const outputPath = path.join(__dirname, '../public/review-analytics.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');

    console.log('\n✅ Phân tích hoàn tất!');
    console.log(`📊 Kết quả đã lưu vào: ${outputPath}`);
    console.log(`\n📈 Tóm tắt:`);
    console.log(`   - Tổng reviews: ${finalData.totalReviews}`);
    console.log(`   - Đánh giá TB: ${finalData.averageRating}⭐`);
    console.log(`   - Tích cực: ${finalData.sentiment.positive}%`);
    console.log(`   - Trung lập: ${finalData.sentiment.neutral}%`);
    console.log(`   - Tiêu cực: ${finalData.sentiment.negative}%`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

// Chạy phân tích
analyzeReviews();
