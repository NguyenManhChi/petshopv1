# 📊 Hệ thống Phân tích Reviews với AI

## Tổng quan
Hệ thống phân tích thông minh các đánh giá của khách hàng, sử dụng thuật toán AI để:
- Phân loại sentiment (tích cực/trung lập/tiêu cực)
- Trích xuất từ khóa quan trọng
- Đưa ra insights và đề xuất hành động

## Cách sử dụng

### 1. Tạo file phân tích (chạy khi có reviews mới)
```bash
npm run analyze-reviews
```

Script này sẽ:
- Lấy tất cả reviews từ database
- Phân tích thông minh sentiment và keywords
- Lưu kết quả vào `frontend/public/review-analytics.json`

### 2. Xem phân tích trên Admin
1. Mở trình duyệt: `http://localhost:3001/admin`
2. Click menu "Phân tích Reviews"
3. Xem biểu đồ và insights

### 3. Cập nhật phân tích
Mỗi khi có reviews mới, chạy lại:
```bash
npm run analyze-reviews
```

Sau đó refresh trang admin để thấy dữ liệu mới.

## Kết quả phân tích bao gồm:
- 📈 Phân bố sentiment (pie chart)
- 🔑 Top từ khóa được nhắc đến nhiều nhất
- 💡 Insights về điểm mạnh/điểm yếu
- ✅ Đề xuất hành động cải thiện

## Lưu ý
- File `review-analytics.json` được cache ở frontend/public
- Phân tích dựa trên thuật toán AI thông minh, không cần gọi API bên ngoài
- Đảm bảo backend (port 3000) đang chạy khi thực hiện phân tích
