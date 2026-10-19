# سامانه مدیریت ارتباط با مشتری (Persian RTL CRM) - فاز ۱

یک وب‌اپلیکیشن مدرن، مینیمال و پاک برای مدیریت ارتباط با مشتریان (CRM) ویژه تیم‌های فروش به زبان فارسی و جهت راست‌چین (RTL). این رابط کاربری با فریم‌ورک‌های Vite، React 18/19، TypeScript، Ant Design 5 و React Query توسعه داده شده است.

---

## ۱. راهنمای نصب و راه‌اندازی (Install & Run)

```bash
# ۱. نصب وابستگی‌های پروژه
npm install

# ۲. اجرای سرور توسعه (پورت 3000 / 5173 با پروکسی فعال به سمت بک‌اند NocoBase)
npm run dev

# ۳. بررسی صحت تایپ‌های تایپ‌اسکریپت
npm run typecheck

# ۴. ساخت نسخه نهایی جهت استقرار در محیط عملیاتی
npm run build
```

---

## ۲. ساختار پروکسی بک‌اند (API Proxy)

- کلیه درخواست‌های شبکه به مسیر نسبی `/api/*` ارسال می‌شوند.
- در محیط توسعه، کانفیگ Vite در فایل `vite.config.ts` ترافیک `/api` را به آدرس `http://localhost:13000` هدایت (Proxy) می‌کند (`changeOrigin: true`).
- در محیط عملیاتی (Production)، Reverse Proxy (مانند Nginx یا Cloud Run) رابط کاربری SPA و سرور API را روی یک دامنه یکسان سرویس‌دهی می‌کند؛ بنابراین هیچ نام هاستی به صورت هاردکد شده در پروژه وجود ندارد.

---

## ۳. ساختار پوشه‌ها و فایل‌های پروژه (Directory Structure)

```text
├── .env.example              # نمونه متغیرهای محیطی
├── .gitignore                # فایل‌های نادیده‌گرفته‌شده توسط گیت
├── index.html                # سند اصلی با lang="fa" و dir="rtl"
├── metadata.json             # فراداده برنامه در محیط AI Studio
├── package.json              # پکیج‌ها و اسکریپت‌های npm
├── tsconfig.json             # پیکربندی Strict تایپ‌اسکریپت و alias @/ -> src/
├── vite.config.ts            # تنظیمات پلاگین ری‌اکت و پروکسی /api
├── README.md                 # راهنمای فنی پروژه
└── src/
    ├── main.tsx              # نقطه ورود کلاینت و رندر درخت کامپوننت‌ها
    ├── App.tsx               # سلسله‌مراتب Providerها (ConfigProvider, QueryClient, Auth, Router)
    ├── index.css             # استایل‌های پایه و ایمپورت فونت‌های Vazirmatn
    ├── router.tsx            # ساختار مسیرها با createBrowserRouter و ProtectedRoute
    ├── api/
    │   ├── types.ts          # تایپ‌ها و اینترفیس‌های CRM، پارامترها و پاسخ‌های API
    │   ├── client.ts         # کلاینت عمومی request، نرمال‌سازی خطاها، مدیریت 401 و کوئری‌استرینگ
    │   ├── auth.ts           # متدهای احراز هویت (signIn و checkAuth)
    │   ├── resource.ts       # فکتوری متدهای CRUD (شرکت‌ها، مخاطبین، معاملات، فعالیت‌ها)
    │   └── queryKeys.ts      # کلیدهای متمرکز کش برای React Query
    ├── auth/
    │   ├── token.ts          # مدیریت امن توکن در localStorage (تنها نقطه دسترسی به localStorage)
    │   ├── AuthProvider.tsx  # کانتکست وضعیت کاربر (loading, authenticated, unauthenticated)
    │   ├── useAuth.ts        # هوک دسترسی به وضعیت لاگین و متدهای ورود و خروج
    │   └── ProtectedRoute.tsx# گارد مسیرهای محافظت‌شده با نمایش اسپینر در حین بارگذاری
    ├── components/
    │   ├── PageHeader.tsx    # هدر استاندارد صفحات همراه با عنوان، زیرعنوان و دکمه‌های عملیات
    │   ├── EmptyState.tsx    # نمایش وضعیت خالی داده‌ها به زبان فارسی
    │   ├── ErrorState.tsx    # نمایش وضعیت خطا همراه با دکمه تلاش مجدد
    │   ├── LoadingState.tsx  # نمایش نشانگر در حال بارگذاری
    │   └── ConfirmDelete.tsx # مودال تایید عملیات حذف با متن‌های فارسی
    ├── i18n/
    │   └── fa.ts             # دیکشنری متمرکز تمام رشته‌های متنی، اعتبارسنجی‌ها و پیام‌ها
    ├── layouts/
    │   └── AppLayout.tsx     # سایدبار RTL راست‌چین، دراور موبایل، هدر و منوی کاربر
    ├── pages/
    │   ├── LoginPage.tsx     # صفحه ورود کاربر با اعتبارسنجی فارسی و فیلدهای LTR
    │   ├── DashboardPage.tsx # صفحه نگهدارنده داشبورد فروش (تکمیل در فاز ۴)
    │   ├── CompaniesPage.tsx # صفحه نگهدارنده شرکت‌ها (تکمیل در فاز ۲)
    │   ├── ContactsPage.tsx  # صفحه نگهدارنده مخاطبین (تکمیل در فاز ۲)
    │   ├── DealsPage.tsx     # صفحه نگهدارنده معاملات (تکمیل در فاز ۳)
    │   ├── ActivitiesPage.tsx# صفحه نگهدارنده فعالیت‌ها (تکمیل در فاز ۴)
    │   └── NotFoundPage.tsx  # صفحه خطای ۴۰۴ فارسی
    ├── theme/
    │   └── theme.ts          # توکن‌های استایل و تم Ant Design 5 با فونت وزیرمتن
    └── utils/
        ├── format.ts         # توابع فرمت‌بندی اعداد فارسی، ارز (ریال)، تاریخ شمسی (جلالی) و نام
        └── format.test.ts    # آزمون‌های واحد توابع فرمت‌بندی با node:test
```

---

## ۴. فهرست فرضیات تاییدنشده API و موقعیت آنها در کد (UNVERIFIED Assumptions)

تمامی فرضیات استاندارد مربوط به رفتار NocoBase در لایه `src/api/` متمرکز شده و با کامنت `// UNVERIFIED` مشخص گردیده‌اند:

1. **دریافت تکی رکورد با شناسه کلید اصلی (`filterByTk`)**:
   - آدرس: `GET /api/<collection>:get?filterByTk=<id>`
   - موقعیت در فایل: `src/api/resource.ts` (متد `get`)
2. **بروزرسانی جزئی رکورد (`filterByTk`)**:
   - آدرس: `POST /api/<collection>:update?filterByTk=<id>` همراه با بدنه JSON
   - موقعیت در فایل: `src/api/resource.ts` (متد `update`)
3. **حذف رکورد (`filterByTk`)**:
   - آدرس: `POST /api/<collection>:destroy?filterByTk=<id>`
   - موقعیت در فایل: `src/api/resource.ts` (متد `destroy`)
4. **اعتبارسنجی توکن و دریافت کاربر جاری**:
   - آدرس: `GET /api/auth:check`
   - موقعیت در فایل‌ها: `src/api/auth.ts` (متد `checkAuth`) و `src/auth/AuthProvider.tsx` (در صورت دریافت هر خطایی غیر از ۴۰۱، جهت جلوگیری از مسدود شدن کاربر در حالت آفلاین/توسعه، توکن محلی معتبر شمرده می‌شود)
5. **ساختار بدنه خطاهای سرور**:
   - فرض اولیه بر اساس `{"errors":[{"message":"..."}]}` پیاده‌سازی شده اما در نرمالایزر `src/api/client.ts` ساختارهای `message` یا `error` مستقیم نیز پوشش داده شده و در نهایت پیام خطای فارسی پیش‌فرض نمایش داده می‌شود.
6. **خروج از سیستم (Sign-Out)**:
   - صرفاً سمت کلاینت با پاک کردن توکن از `localStorage` در `src/auth/token.ts` و `AuthProvider.tsx` مدیریت می‌شود.
