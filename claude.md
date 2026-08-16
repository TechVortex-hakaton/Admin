CLAUDE.md — ADMIN
1. LOYIHA
Bu repository Admin Panel frontendidir.
Repository:
Admin
Admin panel platformadagi barcha asosiy ma'lumotlarni boshqarish uchun ishlatiladi.
Admin:
Users
Doctors
Patients
Appointments
Articles
Categories
Sports
Statistics
ni boshqaradi.
Backend:
Server
repository orqali API beradi.
2. TEXNOLOGIYALAR
React
Vite
TypeScript
Tailwind CSS
React Router
Axios
TanStack Query
React Hook Form
Zod
Recharts
Lucide React
3. STRUCTURE
src/
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── users/
│   ├── doctors/
│   ├── patients/
│   ├── appointments/
│   ├── articles/
│   └── sports/
│
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Users/
│   ├── Doctors/
│   ├── Patients/
│   ├── Appointments/
│   ├── Articles/
│   ├── Sports/
│   ├── Categories/
│   └── Settings/
│
├── layouts/
│   ├── AuthLayout.tsx
│   └── AdminLayout.tsx
│
├── services/
├── hooks/
├── types/
├── routes/
├── utils/
└── App.tsx
4. ROUTES
/login

/dashboard

/users
/doctors
/patients
/appointments
/articles
/sports
/categories
/settings
5. LOGIN
Admin login:
Email
Password
API:
POST /api/auth/login
Faqat:
role === ADMIN
bo‘lgan user panelga kira oladi.
6. DASHBOARD
Dashboard:
Total Users
Total Doctors
Total Patients
Total Appointments
Today's Appointments
Published Articles
Charts:
Users Growth
Appointments
Doctors
Patients
7. USERS
/users
Table:
Name
Email
Role
Status
Created At
Actions
Actions:
View
Block
Unblock
Delete
API:
GET /api/admin/users
PUT /api/admin/users/:id/status
DELETE /api/admin/users/:id
8. DOCTORS
/doctors
Table:
Name
Specialization
Experience
Email
Status
Actions
Admin doctor yaratishi mumkin:
POST /api/admin/doctors
Update:
PUT /api/admin/doctors/:id
Delete:
DELETE /api/admin/doctors/:id
9. PATIENTS
/patients
Table:
Name
Age
Phone
Doctor
Status
Created At
Search va filter bo‘lsin.
10. APPOINTMENTS
/appointments
Table:
Patient
Doctor
Date
Time
Reason
Status
Filter:
Doctor
Status
Date
11. ARTICLES
/articles
Admin:
Create
Read
Update
Delete
Publish
Unpublish
Fields:
Title
Slug
Description
Content
Category
Image
Published
API:
GET /api/admin/articles
POST /api/admin/articles
PUT /api/admin/articles/:id
DELETE /api/admin/articles/:id
12. SPORTS
/sports
CRUD:
Title
Description
Category
Duration
Difficulty
Calories
Image
Active
API:
GET /api/admin/sports
POST /api/admin/sports
PUT /api/admin/sports/:id
DELETE /api/admin/sports/:id
13. CATEGORIES
/categories
Admin category yaratadi:
Name
Slug
Type
CRUD API:
GET /api/categories
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id
14. SIDEBAR
Dashboard

Management
├── Users
├── Doctors
├── Patients
└── Appointments

Content
├── Articles
├── Sports
└── Categories

System
├── Settings
└── Logout
15. UI
Admin panel professional SaaS dashboard ko‘rinishida bo‘lsin.
Desktop:
Sidebar
Main content
Tablelar:
pagination
search
filters
sorting
loading
empty state
16. COMPONENTS
Reusable:
Sidebar
Navbar
StatCard
DataTable
Pagination
SearchInput
FilterDropdown
Modal
ConfirmDialog
FormInput
Select
Badge
Toast
ChartCard
LoadingSkeleton
EmptyState
17. API
.env:
VITE_API_URL=http://localhost:5000/api
Services:
auth.service.ts
admin.service.ts
user.service.ts
doctor.service.ts
patient.service.ts
appointment.service.ts
article.service.ts
sport.service.ts
category.service.ts
18. SECURITY
Admin panelda:
ProtectedRoute
AdminRoute
bo‘lsin.
Faqat:
role === ADMIN
kirishi mumkin.
401:
/login
403:
/access-denied
19. RESPONSIVE
Desktop:
Sidebar + Table
Tablet:
Collapsed Sidebar
Mobile:
Mobile Navbar
Scrollable Tables
20. ACCEPTANCE CRITERIA
Admin login
Protected routes
Dashboard
Statistics
Users
Doctors
Patients
Appointments
Articles CRUD
Sports CRUD
Categories CRUD
Search
Filter
Pagination
Charts
Loading states
Error states
Empty states
Responsive design