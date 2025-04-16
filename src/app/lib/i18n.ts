import { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    welcome: 'Welcome to Falcons Supporters League',
    login: 'Login',
    register: 'Register',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
    required: 'This field is required',
    invalid: 'Invalid input',
  },
  landing: {
    hero: {
      title: 'Join the Falcons Supporters League',
      subtitle: 'Support your favorite esports team and earn exclusive rewards',
      cta: 'Join Now',
    },
    features: {
      title: 'Why Join Us?',
      attendEvents: {
        title: 'Attend Events',
        description: 'Register for Esports World Cup 2025 tournaments and support Falcons',
      },
      earnRewards: {
        title: 'Earn Rewards',
        description: 'Get exclusive merchandise and VIP tickets as you attend more events',
      },
      connectFans: {
        title: 'Connect with Fans',
        description: 'Meet other Falcons supporters and build your community',
      },
    },
  },
  registration: {
    title: 'Create Your Account',
    subtitle: 'Join the Falcons Supporters League and start earning rewards',
    fullName: 'Full Name',
    email: 'Email Address',
    phoneNumber: 'Phone Number',
    location: 'Location (City/Region)',
    favoriteGames: 'Favorite Games',
    termsAgree: 'I agree to the terms and conditions',
    submitButton: 'Create Account',
    loginPrompt: 'Already have an account?',
    loginLink: 'Login here',
    successMessage: 'Account created successfully! Verify your phone number to continue.',
  },
  games: {
    dota2: 'DOTA 2',
    mobileLegends: 'Mobile Legends',
    codWarzone: 'Call of Duty: Warzone',
    apexLegends: 'Apex Legends',
    fifa25: 'FIFA 25',
    rennsport: 'RENNSPORT (R1)',
    fortnite: 'FORTNITE',
    freeFire: 'Free Fire',
    honorOfKings: 'Honor of Kings',
    overwatch2: 'Overwatch 2',
    pubgMobile: 'PUBG Mobile',
    pubgBattlegrounds: 'PUBG Battlegrounds (PC)',
    rocketLeague: 'Rocket League',
    streetFighter: 'Street Fighter',
    teamfightTactics: 'Teamfight Tactics',
    tekken8: 'Tekken 8',
  },
  verification: {
    title: 'Verify Your Phone Number',
    subtitle: 'We\'ve sent a verification code to your phone',
    codeLabel: 'Verification Code',
    submitButton: 'Verify',
    resendCode: 'Resend Code',
    successMessage: 'Phone number verified successfully!',
  },
  loyalty: {
    title: 'Loyalty Rewards',
    subtitle: 'Attend events and earn exclusive rewards',
    currentPoints: 'Current Points',
    nextReward: 'Next Reward',
    rewards: {
      scarf: 'Falcons Scarf',
      vipTicket: 'VIP Ticket',
      jersey: 'Falcons Jersey',
    },
    milestones: {
      scarf: 'Attend 1 event',
      vipTicket: 'Attend 3 events',
      jersey: 'Attend 10 events',
    },
  },
};

// Arabic translations
const arTranslations = {
  common: {
    welcome: 'مرحبًا بك في رابطة مشجعي الصقور',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح!',
    required: 'هذا الحقل مطلوب',
    invalid: 'إدخال غير صالح',
  },
  landing: {
    hero: {
      title: 'انضم إلى رابطة مشجعي الصقور',
      subtitle: 'ادعم فريقك المفضل للرياضات الإلكترونية واحصل على مكافآت حصرية',
      cta: 'انضم الآن',
    },
    features: {
      title: 'لماذا تنضم إلينا؟',
      attendEvents: {
        title: 'حضور الفعاليات',
        description: 'سجل في بطولات كأس العالم للرياضات الإلكترونية 2025 وادعم الصقور',
      },
      earnRewards: {
        title: 'اكسب المكافآت',
        description: 'احصل على منتجات حصرية وتذاكر VIP كلما حضرت المزيد من الفعاليات',
      },
      connectFans: {
        title: 'تواصل مع المشجعين',
        description: 'قابل مشجعي الصقور الآخرين وابنِ مجتمعك',
      },
    },
  },
  registration: {
    title: 'إنشاء حسابك',
    subtitle: 'انضم إلى رابطة مشجعي الصقور وابدأ في كسب المكافآت',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    location: 'الموقع (المدينة/المنطقة)',
    favoriteGames: 'الألعاب المفضلة',
    termsAgree: 'أوافق على الشروط والأحكام',
    submitButton: 'إنشاء حساب',
    loginPrompt: 'هل لديك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول هنا',
    successMessage: 'تم إنشاء الحساب بنجاح! تحقق من رقم هاتفك للمتابعة.',
  },
  games: {
    dota2: 'دوتا 2',
    mobileLegends: 'موبايل ليجندز',
    codWarzone: 'كول أوف ديوتي: وارزون',
    apexLegends: 'أبيكس ليجندز',
    fifa25: 'فيفا 25',
    rennsport: 'رينسبورت (R1)',
    fortnite: 'فورتنايت',
    freeFire: 'فري فاير',
    honorOfKings: 'هونر أوف كينجز',
    overwatch2: 'أوفرواتش 2',
    pubgMobile: 'ببجي موبايل',
    pubgBattlegrounds: 'ببجي باتلجراوندز (PC)',
    rocketLeague: 'روكيت ليج',
    streetFighter: 'ستريت فايتر',
    teamfightTactics: 'تيمفايت تاكتيكس',
    tekken8: 'تيكن 8',
  },
  verification: {
    title: 'تحقق من رقم هاتفك',
    subtitle: 'لقد أرسلنا رمز التحقق إلى هاتفك',
    codeLabel: 'رمز التحقق',
    submitButton: 'تحقق',
    resendCode: 'إعادة إرسال الرمز',
    successMessage: 'تم التحقق من رقم الهاتف بنجاح!',
  },
  loyalty: {
    title: 'مكافآت الولاء',
    subtitle: 'احضر الفعاليات واحصل على مكافآت حصرية',
    currentPoints: 'النقاط الحالية',
    nextReward: 'المكافأة التالية',
    rewards: {
      scarf: 'وشاح الصقور',
      vipTicket: 'تذكرة VIP',
      jersey: 'قميص الصقور',
    },
    milestones: {
      scarf: 'حضور فعالية واحدة',
      vipTicket: 'حضور 3 فعاليات',
      jersey: 'حضور 10 فعاليات',
    },
  },
};

// Initialize i18n
const i18nConfig = {
  resources: {
    en: enTranslations,
    ar: arTranslations,
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
};

i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
