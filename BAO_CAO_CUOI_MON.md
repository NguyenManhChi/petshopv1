**TRƯỜNG ĐẠI HỌC ĐIỆN LỰC**
**KHOA CÔNG NGHỆ THÔNG TIN**

---

# BÁO CÁO CHUYÊN ĐỀ HỌC PHẦN
## NGÔN NGỮ KỊCH BẢN

---

### ĐỀ TÀI:
# XÂY DỰNG WEBSITE BÁN ĐỒ THÚ CƯNG

---

**Sinh viên thực hiện:** [Họ và tên sinh viên]

**MSSV:** [Mã số sinh viên]

**Giảng viên hướng dẫn:** [Tên giảng viên]

**Ngành:** CÔNG NGHỆ THÔNG TIN

**Chuyên ngành:** CÔNG NGHỆ PHẦN MỀM

**Lớp:** [Tên lớp]

**Khóa:** 2020 – 2025

---

*Hà Nội, tháng 12 năm 2024*

---

## PHIẾU CHẤM ĐIỂM

**Sinh viên thực hiện:**

| STT | Họ và tên sinh viên | MSSV | Nội dung thực hiện | Điểm | Chữ ký |
|-----|---------------------|------|-------------------|------|--------|
| 1   | [Tên sinh viên]     |      |                   |      |        |

**Giảng viên chấm:**

| Họ và tên | Chữ ký | Ghi chú |
|-----------|--------|---------|
| Giảng viên chấm 1: | | |
| Giảng viên chấm 2: | | |

---

## MỤC LỤC

### LỜI MỞ ĐẦU

### CHƯƠNG 1: GIỚI THIỆU CHUNG
- 1.1. Giới thiệu về Node.js
- 1.2. Giới thiệu về React.js  
- 1.3. Giới thiệu hệ quản trị cơ sở dữ liệu PostgreSQL

### CHƯƠNG 2: KHẢO SÁT HIỆN TRẠNG VÀ THIẾT KẾ HỆ THỐNG
- 2.1. Khảo sát hiện trạng
- 2.2. Mô tả bài toán
  - 2.2.1. Các chức năng hệ thống
  - 2.2.2. Yêu cầu về chức năng
  - 2.2.3. Yêu cầu phi chức năng
  - 2.2.4. Công cụ lập trình và ngôn ngữ sử dụng
- 2.3. Đặc tả chức năng của hệ thống
  - 2.3.1. Usecase tổng quát
  - 2.3.2. Mô tả usecase
  - 2.3.3. Biểu đồ tuần tự

### CHƯƠNG 3: GIAO DIỆN WEBSITE
- 3.1. Giao diện đăng nhập của Admin
- 3.2. Giao diện đăng nhập, đăng ký của khách hàng
- 3.3. Giao diện Admin
- 3.4. Giao diện trang chủ
- 3.5. Giao diện giỏ hàng
- 3.6. Giao diện chi tiết sản phẩm
- 3.7. Giao diện thanh toán

### KẾT LUẬN

### TÀI LIỆU THAM KHẢO

---

## LỜI MỞ ĐẦU

### 1. Lý do chọn đề tài

Trong thời đại công nghệ ngày nay, sự phổ biến của mạng Internet đã mở ra những cơ hội mới cho việc kinh doanh trực tuyến. Việc xây dựng một trang web bán hàng không chỉ là một cơ hội kinh doanh mà còn là thách thức đối với em, người muốn kết hợp sự sáng tạo và kỹ năng lập trình.

Thị trường thú cưng tại Việt Nam đang phát triển mạnh mẽ với nhu cầu ngày càng tăng về sản phẩm chăm sóc thú cưng. Tuy nhiên, nhiều cửa hàng vẫn chưa tận dụng được tiềm năng của thương mại điện tử để tiếp cận khách hàng rộng rãi hơn.

Chính vì lẽ đó, quyết định chọn đề tài "Xây dựng Website Bán Đồ Thú cưng bằng Node.js và React.js" không chỉ là sự lựa chọn cá nhân mà còn là sự đánh giá cao về tiềm năng mà các công nghệ hiện đại mang lại trong việc phát triển ứng dụng web đa dạng và mạnh mẽ. Node.js và React.js không chỉ là những công nghệ phổ biến mà còn giúp em tối ưu hóa hiệu suất và đáp ứng nhanh chóng, tạo ra trải nghiệm người dùng tốt nhất.

Đặc biệt, việc tích hợp Trí tuệ Nhân tạo (AI) với Google Gemini vào hệ thống sẽ giúp nâng cao trải nghiệm khách hàng thông qua chatbot tư vấn thông minh, phân tích đánh giá tự động và tìm kiếm sản phẩm bằng ngôn ngữ tự nhiên.

Em hy vọng rằng dự án này không chỉ mang lại sự hiểu biết sâu rộng về Node.js, React.js và AI mà còn là một bước tiến quan trọng trong việc áp dụng kiến thức lý thuyết vào thực tế, từ đó đạt được kết quả tích cực trong lĩnh vực phát triển web và thương mại điện tử.

### 2. Cấu trúc của báo cáo

Cấu trúc báo cáo sẽ chia thành 3 chương chính:

- **Chương 1:** Giới thiệu chung về các công nghệ sử dụng
- **Chương 2:** Khảo sát hệ thống và thiết kế hệ thống  
- **Chương 3:** Giao diện website và kết quả đạt được

---

## CHƯƠNG 1: GIỚI THIỆU CHUNG

### 1.1. Giới thiệu về Node.js

Website Bán Đồ Thú cưng là một hệ thống thương mại điện tử toàn diện, được xây dựng nhằm số hóa quy trình kinh doanh và quản lý cửa hàng thú cưng trực tuyến.

### 1.1.1. Ứng dụng Node.js trong Website Bán Đồ Thú cưng

- **Hệ thống trò chuyện trực tuyến và chatbot:** Website bán đồ thú cưng sử dụng Node.js để xây dựng chức năng chat hỗ trợ khách hàng, tư vấn sản phẩm, giải đáp thắc mắc nhanh chóng. Nhờ cấu trúc bất đồng bộ, hệ thống có thể phục vụ nhiều khách hàng cùng lúc, tích hợp chatbot AI để nâng cao trải nghiệm.

- **Kết nối thiết bị IoT:** Node.js giúp website dễ dàng tích hợp với các thiết bị thông minh như máy cho thú cưng ăn tự động, cảm biến môi trường, camera giám sát, thu thập và xử lý dữ liệu về sức khỏe, hoạt động của thú cưng.

- **Xử lý truyền tải dữ liệu lớn:** Website có thể sử dụng Node.js để truyền tải hình ảnh, video sản phẩm, livestream hướng dẫn chăm sóc thú cưng, đảm bảo tốc độ và hiệu quả nhờ khả năng stream dữ liệu mạnh mẽ.

- **Xây dựng SPA (Single Page Application):** Kết hợp Node.js với React.js để phát triển website bán hàng dạng SPA, giúp tăng tốc độ tải trang, chuyển đổi giữa các chức năng mượt mà, nâng cao trải nghiệm người dùng.

- **Phát triển RESTful API:** Node.js là nền tảng lý tưởng để xây dựng API cho website, giúp frontend và backend giao tiếp hiệu quả, dễ dàng mở rộng các chức năng như quản lý sản phẩm, đơn hàng, người dùng, đánh giá, khuyến mãi, banner, v.v. Các thư viện như Express.js giúp phát triển nhanh, bảo trì thuận tiện.

### 1.2. Giới thiệu về React.js

React.js là một thư viện JavaScript phổ biến được sử dụng để xây dựng giao diện người dùng, đặc biệt là cho các ứng dụng đơn trang (SPA). React cho phép phát triển giao diện người dùng một cách linh hoạt, hiệu quả và dễ bảo trì.

Một số ưu điểm nổi bật của React.js:

- **Tái sử dụng thành phần:** React cho phép xây dựng các thành phần giao diện độc lập, có thể tái sử dụng, giúp tiết kiệm thời gian và công sức phát triển.

- **Cập nhật và quản lý trạng thái hiệu quả:** React sử dụng Virtual DOM để tối ưu hóa việc cập nhật giao diện, chỉ thay đổi những phần tử thực sự cần thiết, từ đó nâng cao hiệu suất ứng dụng.

- **Dễ dàng tích hợp với các thư viện và framework khác:** React có thể dễ dàng tích hợp với các thư viện hoặc framework khác như Redux để quản lý trạng thái, React Router để quản lý điều hướng, v.v.

- **Cộng đồng lớn và tài liệu phong phú:** React có một cộng đồng phát triển lớn mạnh, cung cấp nhiều tài liệu, hướng dẫn và công cụ hỗ trợ hữu ích.

### 1.3. Giới thiệu hệ quản trị cơ sở dữ liệu PostgreSQL

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở, nổi bật với khả năng lưu trữ dữ liệu lớn, bảo mật cao và hỗ trợ các tính năng ACID đảm bảo tính toàn vẹn dữ liệu. PostgreSQL cho phép thiết kế các bảng dữ liệu có quan hệ chặt chẽ, phù hợp với các hệ thống thương mại điện tử như website bán đồ thú cưng, nơi cần quản lý sản phẩm, đơn hàng, người dùng, đánh giá, khuyến mãi, v.v.

- **Cấu trúc linh hoạt:** PostgreSQL hỗ trợ các kiểu dữ liệu đa dạng, cho phép lưu trữ thông tin sản phẩm, khách hàng, đơn hàng, đánh giá một cách hiệu quả và mở rộng dễ dàng.
- **Bảo mật và hiệu năng:** Hệ thống phân quyền, mã hóa dữ liệu, tối ưu truy vấn giúp website vận hành ổn định, bảo mật thông tin khách hàng.
- **Hỗ trợ các công cụ quản lý:** Các công cụ như pgAdmin giúp quản trị viên dễ dàng thao tác, quản lý cơ sở dữ liệu, sao lưu và phục hồi dữ liệu nhanh chóng.
- **Tương thích đa nền tảng:** PostgreSQL có thể triển khai trên nhiều hệ điều hành như Windows, Linux, MacOS, thuận tiện cho việc phát triển và vận hành website bán hàng.

Việc lựa chọn PostgreSQL cho website bán đồ thú cưng giúp đảm bảo hệ thống lưu trữ dữ liệu an toàn, hiệu quả, dễ mở rộng và tích hợp với các công nghệ hiện đại như Node.js, React.js.

---

## CHƯƠNG 2. KHẢO SÁT HIỆN TRẠNG VÀ THIẾT KẾ HỆ THỐNG

### 2.1. Khảo sát hiện trạng

Hiện nay, thị trường thương mại điện tử ngành thú cưng tại Việt Nam đang phát triển mạnh mẽ. Tuy nhiên, khảo sát cho thấy nhiều website bán đồ thú cưng vẫn còn tồn tại một số thách thức và cơ hội cần được xem xét:

**Yếu điểm:**
- **Giao diện người dùng:** Nhiều website chưa tối ưu hóa giao diện, trải nghiệm người dùng chưa thân thiện, thao tác còn phức tạp, dẫn đến tỷ lệ thoát trang cao.
- **Tích hợp thanh toán:** Một số website gặp khó khăn trong việc tích hợp các phương thức thanh toán đa dạng, thuận tiện, ảnh hưởng đến quá trình mua sắm và giảm sự tin cậy của khách hàng.
- **Hiệu suất trang web:** Tốc độ tải trang và khả năng đáp ứng chưa tốt, dễ làm mất khách hàng và giảm hiệu quả kinh doanh.

**Cơ hội:**
- **Tích hợp công nghệ mới:** Việc ứng dụng Node.js, React.js, AI chatbot giúp tối ưu hiệu suất, nâng cao trải nghiệm người dùng và hỗ trợ khách hàng tốt hơn.
- **Phát triển ứng dụng di động:** Xây dựng app bán hàng cho thú cưng giúp tiếp cận và giữ chân khách hàng hiệu quả hơn.
- **Chăm sóc khách hàng:** Tăng cường dịch vụ chăm sóc khách hàng, triển khai các chương trình khuyến mãi, tích điểm, giúp tăng giá trị đơn hàng và sự trung thành của khách hàng.

Nhìn chung, với sự thấu hiểu sâu sắc về những yếu điểm và cơ hội này, website bán đồ thú cưng có thể xây dựng chiến lược phát triển mạnh mẽ, đáp ứng nhu cầu ngày càng tăng của thị trường và nâng cao vị thế cạnh tranh.

### 2.2. Mô tả bài toán

#### 2.2.1. Các chức năng hệ thống

**Admin:**
- Đăng nhập/đăng xuất trang quản trị
- Quản lý sản phẩm: thêm, sửa, xóa, cập nhật thông tin, hình ảnh
- Quản lý danh mục: thêm, sửa, xóa danh mục sản phẩm
- Quản lý đơn hàng: duyệt, hủy, xem chi tiết đơn hàng
- Quản lý người dùng, đánh giá, khuyến mãi, banner
- Xem thống kê, báo cáo

**User (Khách hàng):**
- Đăng ký, đăng nhập, đăng xuất
- Xem sản phẩm theo danh mục, tìm kiếm, lọc, xem chi tiết
- Thêm sản phẩm vào giỏ hàng, chọn số lượng
- Đặt hàng, nhập thông tin giao hàng, thanh toán
- Xem lịch sử đơn hàng, đánh giá sản phẩm

#### 2.2.2. Yêu cầu về chức năng

| Vai trò | Chức năng |
|---------|-----------|
| Admin   | Đăng nhập, quản lý sản phẩm, danh mục, đơn hàng, người dùng, khuyến mãi, banner, thống kê |
| User    | Đăng ký, đăng nhập, xem sản phẩm, thêm vào giỏ hàng, đặt hàng, thanh toán, đánh giá |

#### 2.2.3. Yêu cầu phi chức năng

- Giao diện thân thiện, dễ dùng, hấp dẫn
- Hệ thống chạy ổn định, bảo mật tốt
- Đáp ứng nhanh, hiệu năng cao
- Tích hợp AI chatbot, phân tích đánh giá tự động
- Dễ mở rộng, bảo trì

#### 2.2.4. Công cụ lập trình và ngôn ngữ sử dụng

- Backend: Node.js, Express.js
- Frontend: React.js
- Database: PostgreSQL
- Công cụ: Visual Studio Code, Postman, Git
- Tích hợp AI: Google Gemini API

### 2.3. Đặc tả chức năng của hệ thống

#### 2.3.1. Usecase tổng quát

- Đăng nhập/đăng xuất
- Đăng ký tài khoản
- Quản lý sản phẩm/danh mục/đơn hàng
- Xem sản phẩm, đặt hàng, thanh toán
- Đánh giá sản phẩm

#### 2.3.2. Mô tả usecase (ví dụ)

**Usecase Đăng nhập**
- Tên: Đăng nhập
- Mô tả: Cho phép người dùng đăng nhập vào hệ thống
- Actor: Admin, User
- Tiền điều kiện: Có tài khoản
- Hậu điều kiện: Đăng nhập thành công
- Luồng chính: Hiển thị form đăng nhập → nhập thông tin → xác thực → chuyển về trang chủ

**Usecase Quản lý sản phẩm**
- Tên: Quản lý sản phẩm
- Mô tả: Admin thêm, sửa, xóa sản phẩm
- Actor: Admin
- Tiền điều kiện: Đăng nhập thành công
- Hậu điều kiện: Sản phẩm được cập nhật

**Usecase Đặt hàng**
- Tên: Đặt hàng
- Mô tả: User chọn sản phẩm, thêm vào giỏ, nhập thông tin giao hàng, thanh toán
- Actor: User
- Tiền điều kiện: Đăng nhập thành công
- Hậu điều kiện: Đơn hàng được tạo

#### 2.3.3. Biểu đồ tuần tự (mô tả text)

- Đăng nhập: User nhập thông tin → hệ thống xác thực → trả về kết quả
- Đăng ký: User nhập thông tin → hệ thống kiểm tra → tạo tài khoản mới
- Quản lý sản phẩm: Admin thao tác → hệ thống cập nhật database → trả về kết quả
- Đặt hàng: User chọn sản phẩm → thêm vào giỏ → nhập thông tin → xác nhận → hệ thống tạo đơn hàng

---

## CHƯƠNG 3. GIAO DIỆN WEBSITE

### 3.1. Giao diện đăng nhập của Admin
- Form đăng nhập với trường tài khoản, mật khẩu
- Thông báo lỗi khi nhập sai
- Giao diện đơn giản, dễ thao tác

### 3.2. Giao diện đăng nhập, đăng ký của khách hàng
- Form đăng ký: tên, email, mật khẩu, xác nhận mật khẩu
- Form đăng nhập: email, mật khẩu
- Thông báo lỗi, xác thực đầu vào

### 3.3. Giao diện Admin
- Quản lý sản phẩm: danh sách, thêm, sửa, xóa sản phẩm
- Quản lý danh mục: thêm, sửa, xóa danh mục
- Quản lý đơn hàng: duyệt, hủy, xem chi tiết
- Quản lý người dùng, đánh giá, khuyến mãi, banner
- Thống kê, báo cáo

### 3.4. Giao diện trang chủ
- Hiển thị danh sách sản phẩm nổi bật, khuyến mãi
- Banner quảng cáo, danh mục sản phẩm
- Tìm kiếm, lọc sản phẩm

### 3.5. Giao diện giỏ hàng
- Hiển thị sản phẩm đã chọn, số lượng, giá
- Chỉnh sửa số lượng, xóa sản phẩm khỏi giỏ
- Tổng tiền, nút đặt hàng

### 3.6. Giao diện chi tiết sản phẩm
- Ảnh sản phẩm, mô tả, giá, đánh giá
- Thêm vào giỏ hàng, chọn số lượng
- Hiển thị đánh giá của khách hàng

### 3.7. Giao diện thanh toán
- Form nhập thông tin giao hàng
- Chọn phương thức thanh toán
- Xác nhận đơn hàng, thông báo thành công

---

## KẾT LUẬN

Trong quá trình thực hiện đề tài "Xây dựng Website Bán Đồ Thú cưng", em đã áp dụng các công nghệ hiện đại như Node.js, React.js, PostgreSQL và tích hợp AI để xây dựng hệ thống thương mại điện tử hoàn chỉnh. Dự án giúp em hiểu sâu về quy trình phát triển web, tối ưu hóa hiệu suất, bảo mật, đồng thời nâng cao trải nghiệm người dùng với các tính năng thông minh.

Dù còn nhiều thách thức như tối ưu giao diện, tích hợp thanh toán đa dạng, em đã nỗ lực hoàn thiện sản phẩm và rút ra nhiều bài học quý giá. Em xin gửi lời cảm ơn đến thầy/cô và các bạn đã hỗ trợ, chia sẻ kiến thức trong quá trình thực hiện dự án.

---

## TÀI LIỆU THAM KHẢO
1. NodeJS là gì? Tất tần tật về NodeJS bạn cần biết? | ITviec
2. https://expressjs.com/
3. https://react.dev/
4. https://www.postgresql.org/
5. https://hocweb.vn/huong-dan-tung-buoc-tao-restful-api-voi-node-jsexpress-mysql/
6. Tài liệu Google Gemini API

---

## PHỤ LỤC

### A. Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petshop
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:3000

# AI
GEMINI_API_KEY=your_gemini_api_key

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### B. Installation Guide

#### B.1. Prerequisites
```bash
node >= 14.0.0
npm >= 6.0.0
postgresql >= 15.0
```

#### B.2. Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd petshopv1

# Install dependencies
npm install

# Setup database
node database/setup.js

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

#### B.3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### C. API Testing Examples

#### C.1. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#",
    "full_name": "Test User",
    "phone": "0123456789"
  }'
```

#### C.2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

#### C.3. Get Products
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=10"
```

#### C.4. Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      { "product_id": 1, "quantity": 2 }
    ],
    "shipping_address": "123 Test St",
    "payment_method": "cod"
  }'
```

### D. Database Schema

#### D.1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### D.2. Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  brand_id INTEGER REFERENCES brands(id),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### D.3. Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### E. Git Commands Used

```bash
# Initialize repository
git init

# Add files
git add .

# Commit changes
git commit -m "Initial commit"

# Create branches
git checkout -b feature/authentication
git checkout -b feature/products
git checkout -b feature/orders

# Merge branches
git merge feature/authentication

# Push to remote
git push origin main
```

### F. NPM Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "analyze-reviews": "node scripts/analyze-reviews-simple.js",
    "test": "jest",
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix",
    "format": "prettier --write src/**/*.js",
    "format:check": "prettier --check src/**/*.js"
  }
}
```

---

**Ngày hoàn thành báo cáo:** 27/11/2025

**Sinh viên thực hiện:** [Tên sinh viên]

**Lớp:** [Tên lớp]

**MSSV:** [Mã số sinh viên]

**Giảng viên hướng dẫn:** [Tên giảng viên]

---

*Báo cáo này được tạo tự động dựa trên cấu trúc và nội dung thực tế của dự án Pet Shop E-Commerce System.*
