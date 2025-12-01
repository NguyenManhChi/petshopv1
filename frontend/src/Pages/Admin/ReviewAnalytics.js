import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  LinearProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
} from '@mui/icons-material';

const ReviewAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Đọc kết quả phân tích từ file JSON (đã được AI phân tích sẵn)
      const response = await fetch('/review-analytics.json');
      
      if (!response.ok) {
        throw new Error('Chưa có dữ liệu phân tích. Vui lòng chạy script: npm run analyze-reviews');
      }

      const data = await response.json();
      setAnalytics(data);
      console.log('✅ Đã tải dữ liệu phân tích AI!');

    } catch (err) {
      console.error('❌ Lỗi:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          🤖 AI đang phân tích {analytics?.totalReviews || ''} reviews...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Vui lòng đợi 10-20 giây
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const { summary, sentiment, keywords, insights, recommendedActions, totalReviews, averageRating } = analytics;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          🤖 Phân Tích Reviews bằng AI
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchAnalytics}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Reviews
              </Typography>
              <Typography variant="h3">{totalReviews}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đánh giá trung bình
              </Typography>
              <Typography variant="h3">{averageRating} ⭐</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Phân tích lúc
              </Typography>
              <Typography variant="body1">
                {new Date(analytics.analyzedAt).toLocaleString('vi-VN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Tóm tắt
          </Typography>
          <Typography variant="body1">{summary}</Typography>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            😊 Phân tích cảm xúc khách hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SentimentSatisfied sx={{ color: '#4caf50', mr: 1 }} />
                <Typography>Tích cực</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseInt(sentiment.positive)}
                sx={{ height: 10, borderRadius: 5, mb: 1, backgroundColor: '#e0e0e0' }}
                style={{ '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' } }}
              />
              <Typography variant="h6" sx={{ color: '#4caf50' }}>
                {sentiment.positive}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SentimentNeutral sx={{ color: '#ff9800', mr: 1 }} />
                <Typography>Trung lập</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseInt(sentiment.neutral)}
                sx={{ height: 10, borderRadius: 5, mb: 1, backgroundColor: '#e0e0e0' }}
                style={{ '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }}
              />
              <Typography variant="h6" sx={{ color: '#ff9800' }}>
                {sentiment.neutral}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SentimentDissatisfied sx={{ color: '#f44336', mr: 1 }} />
                <Typography>Tiêu cực</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseInt(sentiment.negative)}
                sx={{ height: 10, borderRadius: 5, mb: 1, backgroundColor: '#e0e0e0' }}
                style={{ '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' } }}
              />
              <Typography variant="h6" sx={{ color: '#f44336' }}>
                {sentiment.negative}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔑 Từ khóa phổ biến
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {keywords.map((kw, idx) => (
                    <Chip
                      key={idx}
                      label={`${kw.word} (${kw.count})`}
                      color={
                        kw.sentiment === 'positive'
                          ? 'success'
                          : kw.sentiment === 'negative'
                          ? 'error'
                          : 'default'
                      }
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Insights */}
        {insights && insights.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💡 Nhận xét chi tiết
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {insights.map((insight, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      {insight.includes('mạnh') || insight.includes('tốt') || insight.includes('hài lòng') ? (
                        <TrendingUp sx={{ color: '#4caf50', mr: 1, mt: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#f44336', mr: 1, mt: 0.5 }} />
                      )}
                      <Typography variant="body2">{insight}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recommended Actions */}
        {recommendedActions && recommendedActions.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Đề xuất hành động
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {recommendedActions.map((action, idx) => (
                    <Alert key={idx} severity="info" sx={{ mb: 1 }}>
                      {action}
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ReviewAnalytics;
