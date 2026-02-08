# README Dự án FE

## Giới thiệu
Đây là front cho hệ thống quản lý học viên và chat realtime giữa giảng viên và sinh viên.  
Front sử dụng **React.js**, **Vite**

---

## Cấu trúc thư mục


---

## Mô tả chi tiết

### `src/components`
- Chức các component, các thành phần có thể tái sử dụng

---

### `src/pages`
- Chứa các page chính của dự án
- Ví dụ: trang Dashboard sinh viên, Dashboard giảng viên, Login,...

---
### `src/App.jsx`
- Component gốc của ứng dụng
- Khai báo layout chính
- Chứa routing giữa các page

---

### `src/App.css`
- CSS cho component App
- Dùng để custom style riêng cho layout chính

---

### `src/main.jsx`
- Entry point của React app
- Render `<App />` vào DOM
- Khởi tạo React với Vite

---

### `src/index.css`
- CSS global cho toàn bộ ứng dụng
- Reset style, font chữ, các class dùng chung

---

## Cách chạy dự án

### 1. Cài đặt dependency
```bash
npm install
```
### 2. Chạy dự án
```bash
npm run dev
```