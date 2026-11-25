export type UserGoalTrack = "affiliate" | "builder" | "business" | "ecosystem";

export interface PlatformBlueprint {
  id: string; name: string; badge: string; signupUrl: string;
  whyItMattersHe: string; whyItMattersEn: string;
  externalStepsHe: string[]; externalStepsEn: string[];
  buildBio: (goal: UserGoalTrack, link: string, isHe: boolean) => string;
  buildScript: (goal: UserGoalTrack, link: string, isHe: boolean) => string;
}

export const GOAL_TRACKS: { id: UserGoalTrack; titleHe: string; titleEn: string; descHe: string; descEn: string }[] = [
  { id: "affiliate", titleHe: "שיווק שותפים ודילים חכמים", titleEn: "Affiliate & Smart Deal Marketing", descHe: "בניית ערוצי תנועה אורגנית לקישורי שותפים מאומתים ודפי דילים.", descEn: "Build organic traffic channels for verified affiliate links & deal storefronts." },
  { id: "builder", titleHe: "קידום מוצרי AI ותיק עבודות", titleEn: "AI Products & Verified Portfolio", descHe: "חשיפת פרויקטים חיים, גיוס לקוחות טכנולוגיים והוכחת ביצוע.", descEn: "Showcase live deployments, attract tech clients & prove execution." },
  { id: "business", titleHe: "מיתוג עסקי ושירותים ללקוחות", titleEn: "Business Brand & Client Services", descHe: "נוכחות מקצועית ברשתות המביאה פניות איכותיות ללא פרסום ממומן.", descEn: "Professional brand presence driving inbound leads organically." },
  { id: "ecosystem", titleHe: "ניהול אקוסיסטם וכלים מרובים", titleEn: "Full Multi-Platform Ecosystem", descHe: "שליטה מרכזית בכל הפלטפורמות, האתרים וערוצי ההפצה ממקום אחד.", descEn: "Central command across all websites, tools & distribution channels." },
];
export const PLATFORM_BLUEPRINTS: PlatformBlueprint[] = [
  {
    id: "youtube", name: "YouTube Channel & Shorts", badge: "VIDEO SEO · EVERGREEN", signupUrl: "https://youtube.com",
    whyItMattersHe: "סרטוני Shorts של 30 שניות מביאים צפיות לאורך חודשים ומדורגים גם בחיפוש גוגל.",
    whyItMattersEn: "30-second Shorts drive evergreen views for months and rank directly in Google Search.",
    externalStepsHe: ["פתח ערוץ ביוטיוב והגדר שם מותג ברור", "בהגדרות הערוץ (Customization -> Basic Info) הדבק את הקישור הראשי שלך", "העלה סרטון מסך קצר (30 שנ') המדגים ערך אמיתי והדבק את התיאור המוכן"],
    externalStepsEn: ["Create a YouTube channel with a clear brand name", "Paste your primary link under Customization -> Basic Info", "Upload a 30s screen demo showing real value with the ready description"],
    buildBio: (g, link, he) => he ? `כלים חכמים, הדגמות חיות ופתרונות חוסכי זמן 👇\nכניסה ישירה: ${link}` : `Smart tools, live demos & time-saving workflows 👇\nDirect access: ${link}`,
    buildScript: (g, link, he) => he ? `🎬 תסריט YouTube Shorts / Reels (30 שנ'):\n[0-5 שנ']: "תראו איך חוסכים שעות של עבודה ידנית בכלי אחד חינמי."\n[5-22 שנ']: הדגמת מסך מהירה של הפתרון בפעולה.\n[22-30 שנ']: "הקישור פתוח לשימוש חופשי בתיאור ובתגובה הראשונה: ${link}"` : `🎬 30s Shorts Script:\n[0-5s]: "Here is how to save hours of manual work with one live tool."\n[5-22s]: Quick live screen walkthrough.\n[22-30s]: "Direct link in description & pinned comment: ${link}"`
  },
  {
    id: "tiktok", name: "TikTok Creator / Business", badge: "VIRAL REACH", signupUrl: "https://tiktok.com",
    whyItMattersHe: "הפלטפורמה המהירה ביותר לחשיפה אורגנית מאפס עוקבים באמצעות טיפים קצרים ופרקטיים.",
    whyItMattersEn: "Fastest organic discovery from zero followers via short, practical demos.",
    externalStepsHe: ["צור חשבון עסקי/יוצר והגדר תמונת פרופיל נקייה", "הוסף את הקישור שלך בשדה Website בביו", "צלם הדגמה אנכית (15-25 שנ') והשתמש בתסריט המוכן"],
    externalStepsEn: ["Create a Creator/Business profile with a clean avatar", "Add your link to the Website field in your bio", "Record a 15-25s vertical demo using the ready script"],
    buildBio: (g, link, he) => he ? `כלים דיגיטליים שחוסכים זמן וכסף 🚀\nכניסה ישירה 👇\n${link}` : `Digital tools that save time & unlock value 🚀\nTry live 👇\n${link}`,
    buildScript: (g, link, he) => he ? `📱 פוסט + תסריט TikTok:\nהוק: "3 שניות שמשנות את הדרך שבה אתם עובדים ברשת"\nהדגמה חיה + הנעה לפעולה: כנסו לקישור בביו -> ${link}` : `📱 TikTok Hook & Caption:\n"3 seconds that upgrade your daily workflow" — Live link in bio: ${link}`
  },
  {
    id: "facebook", name: "Facebook Page & Niche Groups", badge: "COMMUNITY & LEADS", signupUrl: "https://facebook.com",
    whyItMattersHe: "קבוצות נישה בישראל ובעולם הן מקור הלידים והתנועה האיכותי ביותר כשמשתפים ערך אמיתי.",
    whyItMattersEn: "Niche groups drive high-intent traffic and leads when sharing genuine value.",
    externalStepsHe: ["פתח דף עסקי מקצועי והגדר כפתור פעולה אל הקישור שלך", "הצטרף ל-3 קבוצות רלוונטיות לתחום שלך", "פרסם פוסט ערך (בלי ספאם) עם הפוסט המוכן למטה"],
    externalStepsEn: ["Create a business page and point the action button to your link", "Join 3 relevant niche groups", "Publish a value-first post using the template below"],
    buildBio: (g, link, he) => he ? `פתרונות דיגיטליים חכמים, כלים פתוחים ותוכן מבוסס ערך והוכחות: ${link}` : `Smart digital solutions, live tools & value-driven resources: ${link}`,
    buildScript: (g, link, he) => he ? `טיפ פרקטי שחוסך המון זמן 👇\nריכזתי עבורכם גישה ישירה לכלי/נכס חי שפתוח לשימוש מיידי:\n${link}\n(מוזמנים לשמור ולשתף עם מי שזה יעזור לו)` : `Practical time-saving resource 👇\nDirect access to a live tool ready to use:\n${link}`
  },
  {
    id: "linkedin", name: "LinkedIn Authority Profile / Page", badge: "B2B & HIGH TRUST", signupUrl: "https://linkedin.com",
    whyItMattersHe: "בונה סמכות מקצועית מול לקוחות עסקיים, מגייסים ושותפים אסטרטגיים.",
    whyItMattersEn: "Builds high-trust authority with business clients, recruiters & partners.",
    externalStepsHe: ["עדכן כותרת פרופיל (Headline) או פתח דף חברה מקצועי", "הוסף את הקישור שלך בסקשן Featured / Website", "פרסם פוסט מקצועי המציג תוצאה אמיתית באוויר"],
    externalStepsEn: ["Update your Headline or create a Company Page", "Add your link in the Featured / Website section", "Publish an authority post showcasing live results"],
    buildBio: (g, link, he) => he ? `בניית נכסים דיגיטליים, מוצרי AI ופתרונות מוכווני תוצאה | ${link}` : `Building verified digital assets, AI systems & high-trust solutions | ${link}`,
    buildScript: (g, link, he) => he ? `במקום להבטיח — בנינו פתרון שעובד באוויר ופתוח להתנסות:\n\nמוזמנים לבדוק את המערכת חיה כאן:\n${link}\n\n#AI #DigitalAssets #Innovation` : `Instead of promises, we shipped a live system open for testing:\n\nExplore it live here:\n${link}\n\n#BuildInPublic #AI #DigitalAssets`
  },
  {
    id: "telegram", name: "Telegram Broadcast Channel", badge: "DIRECT AUDIENCE", signupUrl: "https://telegram.org",
    whyItMattersHe: "100% חשיפה ישירה לכל מנוי בלי אלגוריתם שמגביל תפוצה — מושלם לעדכונים ודילים.",
    whyItMattersEn: "100% direct reach to every subscriber without algorithm throttling.",
    externalStepsHe: ["פתח ערוץ ציבורי חדש בטלגרם ובחר שם קצר וקליט", "הדבק את תיאור הערוץ המוכן ונעץ הודעת פתיחה עם הקישור שלך", "שתף את קישור הערוץ ברשתות האחרות"],
    externalStepsEn: ["Create a public Telegram channel with a clean handle", "Paste the channel bio and pin a welcome post with your link", "Cross-promote your channel across your other profiles"],
    buildBio: (g, link, he) => he ? `הערוץ הרשמי לעדכונים, כלים חכמים והזדמנויות מאומתות 👉 ${link}` : `Official channel for live tools, updates & verified drops 👉 ${link}`,
    buildScript: (g, link, he) => he ? `🚀 עדכון חדש באוויר:\nגישה ישירה ומהירה לנכס/כלי הפעיל שלנו:\n👉 ${link}` : `🚀 New Live Drop:\nDirect access to our active asset/tool:\n👉 ${link}`
  },
  {
    id: "gsc", name: "Google Search Console (SEO)", badge: "SEARCH TRAFFIC", signupUrl: "https://google.com",
    whyItMattersHe: "מאנדקס את הדפים והקישורים שלך בגוגל כדי להביא גולשים שמחפשים פתרון אקטיבית.",
    whyItMattersEn: "Indexes your pages in Google to capture high-intent organic search traffic.",
    externalStepsHe: ["הוסף את כתובת האתר/הפורטפוליו שלך ב-Search Console", "הגש את קובץ sitemap.xml לאינדוקס", "בקש בדיקת כתובת (URL Inspection) לדף הראשי"],
    externalStepsEn: ["Add your site/portfolio URL in Search Console", "Submit your sitemap.xml for crawling", "Request indexing for your primary landing URL"],
    buildBio: (g, link, he) => `${link}/sitemap.xml`,
    buildScript: (g, link, he) => he ? `כתובת להגשה באינדוקס גוגל: ${link}` : `URL to submit for Google Indexing: ${link}`
  }
];