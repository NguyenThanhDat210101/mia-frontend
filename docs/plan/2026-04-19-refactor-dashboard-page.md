# Plan: Refactor DashboardPage

**Date:** 2026-04-19

## Mục tiêu
Tách DashboardPage.vue thành các components nhỏ để tái sử dụng và dễ maintain.

## Hiện trạng
- DashboardPage.vue chứa tất cả: stats, search bar, orders list trong 1 file
- Khó tái sử dụng ở trang khác (OrdersManagementPage)
- Code dài, khó debug

## Cấu trúc mới

```
src/components/molecules/
├── StatsCards.vue      → Row: 4 stat cards (Tổng đơn, Đang chờ, Hoàn thành, Doanh thu)
├── SearchBar.vue      → Row: Date, Table, Phone, Status tabs, Actions
└── OrdersList.vue   → Grid: Order cards (v-if loading → skeletons, v-else → cards)
```

## Data Flow

```
DashboardPage.vue (container)
├── StatsCards.vue (props: stats)
│   - todayStats: { total, pending, completed, cancelled, revenue }
│   
├── SearchBar.vue (emits)
│   - update:filters (date, table, phone, status)
│   - refresh, clear-filters
│   
└── OrdersList.vue (props)
    - orders: Order[]
    - loading: boolean
    - emit: update-status (orderId, status)
```

## Tasks

1. StatsCards.vue
   - Nhận props: stats object
   - 4 Card components hiển thị Tổng đơn, Đang chờ, Hoàn thành, Doanh thu
   - Click vào Doanh thu → navigate to Report

2. SearchBar.vue
   - Props: dateFilter, tableFilter, phoneFilter, statusFilter
   - Emits: update:filters, refresh, clear-filters
   - Gồm: date input, table input, phone input, status tabs, action buttons

3. OrdersList.vue
   - Props: orders[], loading
   - Slots: actions (update status buttons)
   - Grid responsive (1-5 columns)

4. Update DashboardPage.vue
   - Import và sử dụng 3 components mới
   - Giữ nguyên business logic

## Ưu điểm sau refactor

- Tái sử dụng: OrdersManagementPage cùng UI với DashboardPage
- Dễ maintain: Mỗi component ~100 lines
- Dễ test: Unit test từng component
- Dễ debug: Biết ngay lỗi ở đâu

## Files cần tạo

1. `src/components/molecules/StatsCards.vue`
2. `src/components/molecules/SearchBar.vue`
3. `src/components/molecules/OrdersList.vue`

## Files cần sửa

1. `src/sites/UserSite/modules/store/views/DashboardPage.vue`