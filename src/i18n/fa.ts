export const fa = {
  app: {
    name: 'SmartBase',
    title: 'SmartBase',
  },
  common: {
    save: 'ذخیره',
    cancel: 'انصراف',
    delete: 'حذف',
    edit: 'ویرایش',
    create: 'ایجاد',
    add: 'افزودن',
    search: 'جستجو...',
    refresh: 'بارگذاری مجدد',
    retry: 'تلاش مجدد',
    back: 'بازگشت',
    actions: 'عملیات',
    confirm: 'تایید',
    close: 'بستن',
    status: 'وضعیت',
    loading: 'در حال بارگذاری...',
    empty: 'موردی برای نمایش وجود ندارد',
  },
  auth: {
    loginTitle: 'ورود به حساب کاربری',
    loginSubtitle: 'برای دسترسی به سامانه اطلاعات خود را وارد کنید',
    account: 'نام کاربری یا ایمیل',
    accountPlaceholder: 'username or email',
    password: 'کلمه عبور',
    passwordPlaceholder: '••••••••',
    loginSubmit: 'ورود به سامانه',
    loggingIn: 'در حال ورود...',
    logout: 'خروج از حساب',
    userProfile: 'حساب کاربری',
    sessionExpired: 'نشست کاربری شما به پایان رسیده است. لطفاً مجدداً وارد شوید.',
    invalidCredentials: 'نام کاربری یا کلمه عبور وارد شده صحیح نمی‌باشد.',
  },
  roles: {
    select: 'انتخاب نقش',
    title: 'نقش کاربری',
  },
  nav: {
    home: 'صفحه اصلی',
    processes: 'فرایندها',
    knowledge: 'دانش سازمانی',
    positions: 'سمت‌های سازمانی',
    externalSync: 'همگام‌سازی داده‌های خارجی',
    knowledgeSettings: 'تنظیمات دانش سازمانی',
    speech: 'تنظیمات گفتار به متن',
    adminPanel: 'ورود به پنل مدیریت',
  },
  home: {
    welcome: 'خوش آمدید، {name}',
    welcomeDefault: 'خوش آمدید',
    quickAccess: 'دسترسی سریع به بخش‌های سامانه',
    noModulesAvailable: 'در حال حاضر بخشی برای دسترسی شما تعریف نشده است.',
  },
  placeholder: {
    inProgress: 'این بخش در حال آماده‌سازی است.',
  },
  knowledge: {
    status: 'وضعیت سرویس دانش سازمانی',
    configured: 'پیکربندی شده',
    notConfigured: 'پیکربندی نشده',
  },
  speech: {
    status: 'وضعیت سرویس گفتار به متن',
    configured: 'فعال',
    notAvailableNotice: 'سرویس گفتار به متن در حال حاضر در دسترس نمی‌باشد.',
  },
  errors: {
    default: 'خطایی در پردازش اطلاعات رخ داد. لطفاً مجدداً تلاش نمایید.',
    networkError: 'خطا در برقراری ارتباط با سرور. لطفاً اتصال شبکه خود را بررسی نمایید.',
    notFound: 'صفحه مورد نظر یافت نشد.',
    forbidden: 'شما دسترسی لازم برای مشاهده این بخش را ندارید.',
    serverError: 'خطای داخلی سرور رخ داده است. لطفاً بعداً تلاش فرمایید.',
  },
  validation: {
    required: 'تکمیل این فیلد الزامی است',
  },
  notFoundPage: {
    title: 'صفحه پیدا نشد (۴۰۴)',
    subtitle: 'صفحه‌ای که به دنبال آن هستید وجود ندارد یا تغییر مسیر داده است.',
    backHome: 'بازگشت به صفحه اصلی',
  },
  forbiddenPage: {
    title: 'عدم دسترسی (۴۰۳)',
    subtitle: 'شما مجوز دسترسی به این بخش را ندارید.',
    backHome: 'بازگشت به صفحه اصلی',
  },
} as const;

export type Translation = typeof fa;

export function t<T = typeof fa>(): T {
  return fa as unknown as T;
}
