// Script phân tích reviews - kết nối trực tiếp database (không cần backend)
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database config
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'petshop',
  user: 'postgres',
  password: 'abcd'
};

// Hàm phân tích thông minh
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

    if (rating >= 4 || hasPositive) {
      positive++;
      if (text.includes('chất lượng')) strengths.push('Sản phẩm được đánh giá cao về chất lượng');
      if (text.includes('giao hàng') || text.includes('nhanh')) strengths.push('Giao hàng nhanh chóng');
      if (text.includes('tốt')) strengths.push('Khách hàng hài lòng với sản phẩm');
    } else if (rating <= 2 || hasNegative) {
      negative++;
      if (text.includes('giao')) issues.push('Có phản hồi tiêu cực về giao hàng');
      if (text.includes('chất lượng')) issues.push('Cần cải thiện chất lượng sản phẩm');
    } else {
      neutral++;
    }

    // Đếm từ khóa
    const words = text.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      if (!['của', 'và', 'cho', 'với', 'được', 'đã', 'rất', 'này', 'đây', 'các', 'có'].includes(word)) {
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
    ].filter(Boolean),
    recommendedActions: [
      negative > total*0.2 ? 'Cải thiện quy trình kiểm soát chất lượng sản phẩm' : 'Duy trì chất lượng sản phẩm hiện tại',
      positive > total*0.6 ? 'Tăng cường marketing với feedback tích cực' : 'Khảo sát thêm để hiểu nhu cầu khách hàng',
      'Phản hồi nhanh các đánh giá tiêu cực để cải thiện trải nghiệm khách hàng'
    ],
    analyzedAt: new Date().toISOString()
  };
}

async function analyzeReviews() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🤖 Bắt đầu phân tích reviews...\n');

    // Kết nối database
    console.log('📥 Đang kết nối database...');
    await client.connect();
    console.log('✅ Đã kết nối database');

    // Lấy reviews
    console.log('📥 Đang lấy reviews...');
    const result = await client.query(`
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        p.product_name,
        u.user_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 100
    `);

    const reviews = result.rows;

    if (!reviews || reviews.length === 0) {
      console.log('⚠️ Không có review nào để phân tích!');
      return;
    }

    console.log(`✅ Đã lấy ${reviews.length} reviews`);

    // Phân tích
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
    console.log(`   - Top keywords: ${analysis.keywords.slice(0, 5).map(k => k.word).join(', ')}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.error('   Chi tiết:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

analyzeReviews();
