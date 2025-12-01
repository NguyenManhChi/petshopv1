// Script phân tích reviews thông minh (không cần AI API)
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
    console.log('🤖 Bắt đầu phân tích reviews...\n');

    // Lấy tất cả reviews
    console.log('📥 Đang lấy reviews từ database...');
    const reviewsResponse = await axios.get(`${API_BASE_URL}/reviews/recent?limit=100`);
    const reviews = reviewsResponse.data.data.reviews;

    if (!reviews || reviews.length === 0) {
      console.log('⚠️ Không có review nào để phân tích!');
      return;
    }

    console.log(`✅ Đã lấy ${reviews.length} reviews`);

    // Phân tích thông minh
    console.log('🧠 Đang phân tích...');
    const analysis = smartAnalyze(reviews);

    // Lưu kết quả
    const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'review-analytics.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

    console.log('\n✅ Hoàn tất! Kết quả đã được lưu vào:', outputPath);
    console.log(`\n📊 Tóm tắt:`);
    console.log(`   - Tổng reviews: ${analysis.totalReviews}`);
    console.log(`   - Điểm TB: ${analysis.averageRating}/5`);
    console.log(`   - Tích cực: ${analysis.sentiment.positive}%`);
    console.log(`   - Tiêu cực: ${analysis.sentiment.negative}%`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

analyzeReviews();
