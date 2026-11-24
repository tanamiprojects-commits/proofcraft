export interface StrategicTrackGuide {
  level: number;
  badge: string;
  name: string;
  tagline: string;
  priceIls: number;
  whoIsItFor: string;
  concreteDeliverable: string;
  careerAndMarketImpact: string;
  includedInFree: boolean;
  highlightFlagship?: boolean;
}

export const AUTODIDACT_MANIFESTO = {
  eyebrow: "סטנדרט ההוכחה החדש למפתחי AI אוטודידקטים",
  headline: "בעידן ה-AI, לקוחות ומגייסים לא שואלים איזה קורס סיימת — הם בודקים איזו מערכת חיה כבר העלית לאוויר.",
  body: "מפתחים שלומדים באופן עצמאי ללא תואר אקדמי פורמלי נתקלים במחסום אחד: איך מוכיחים רמה הנדסית ואמינות עסקית? ProofCraft פותרת זאת באמצעות ארבע מדרגות ייצור מדורגות. מתחילים בחינם לגמרי עם מערכת חיה ראשונה ותיק עבודות פעיל — ומתקדמים בקצב שלך עד לתיק מלא של 4 מערכות ייצור.",
  pillars: [
    {
      title: "הוכחה חיה במקום קורות חיים",
      desc: "כל שלב מסתיים בנכס עובד בכתובת HTTPS אמיתית, עם תיעוד החלטות ארכיטקטורה ואבטחה.",
    },
    {
      title: "התחלה בחינם עם תוצר אמיתי",
      desc: "מסלול 1 פתוח במלואו בחינם — כולל בניית פרופיל מקצועי ותיק עבודות חי עם הפרויקט הראשון שלך.",
    },
    {
      title: "התקדמות ללא כפל תשלום",
      desc: "בכל שדרוג למסלול מתקדם או למסלול הדגל המלא (4 עבודות), כל סכום ששולם בעבר מקוזז אוטומטית.",
    },
  ],
};

export const STRATEGIC_TRACK_GUIDES: StrategicTrackGuide[] = [
  {
    level: 1,
    badge: "חינם במלואו · נקודת הזינוק",
    name: "Junior AI Builder (v1.0)",
    tagline: "בניית מערכת המרה חיה ראשונה + פרופיל ותיק עבודות ציבורי",
    priceIls: 0,
    whoIsItFor: "מפתחים עצמאיים בתחילת הדרך ויוצרים שרוצים להוציא נכס ראשון לייצור ולהציג תיק עבודות אמיתי ללא עלות.",
    concreteDeliverable: "דף נחיתה ממיר בעברית (RTL) + מנוע הזמנות WhatsApp + פרופיל ותיק עבודות ציבורי עם עבודה #1 מאומתת.",
    careerAndMarketImpact: "מעניק לך כרטיס ביקור חי שאפשר לשלוח כבר השבוע ללקוחות ראשונים או לצרף לקורות החיים.",
    includedInFree: true,
  },
  {
    level: 2,
    badge: "מדרגת SaaS וענן · v2.0",
    name: "Full-Stack AI Builder",
    tagline: "מסדי נתונים בענן, ניהול משתמשים ואבטחת RLS",
    priceIls: 149,
    whoIsItFor: "בונים שרוצים לעבור מאתרי תדמית למערכות ניהול לקוחות (CRM / SaaS) שומרות נתונים בעלות ריטיינר גבוהה.",
    concreteDeliverable: "עבודה #2 בתיק: מערכת SaaS מלאה מבוססת Supabase PostgreSQL, הרשאות RLS ואימות משתמשים.",
    careerAndMarketImpact: "מוכיח למעסיקים וללקוחות שאתה יודע לאבטח מידע ולבנות תוכנה אמיתית, לא רק ממשק.",
    includedInFree: false,
  },
  {
    level: 3,
    badge: "אוטומציה וסליקה · v3.0",
    name: "Systems & Web3 Architect",
    tagline: "סליקה מאומתת בשרת, Webhooks, Telegram API ו-Cloudflare",
    priceIls: 299,
    whoIsItFor: "פרילנסרים ויועצים שבונים לעסקים מערכות גבייה, אוטומציות תפעול והתראות בזמן אמת.",
    concreteDeliverable: "עבודה #3 בתיק: מנוע תשלומים מאומת חתימה קריפטוגרפית, אינטגרציות API וחומת אש.",
    careerAndMarketImpact: "ממצב אותך כאיש מערכות שיודע לחבר כסף, אבטחה ואוטומציה בלי תלות במתכנתים חיצוניים.",
    includedInFree: false,
  },
  {
    level: 4,
    badge: "מסלול הדגל המלא · 4 עבודות בתיק",
    name: "Senior AI Systems Architect (v4.0)",
    tagline: "תיק עבודות שלם של 4 מערכות ייצור + פלטפורמת AI ארגונית",
    priceIls: 499,
    whoIsItFor: "מי שמכוון לתפקידי פיתוח בכירים, סוכנויות AI או מכירת מערכות ליבה ללקוחות ארגוניים.",
    concreteDeliverable: "תיק עבודות מלא (4/4 עבודות מדורגות: v1.0 + v2.0 + v3.0 + v4.0), ארכיטקטורת Multi-Tenant, AI Copilot ותעודת הסמכה.",
    careerAndMarketImpact: "חבילת ההוכחה המקיפה ביותר בפלטפורמה: תיק עבודות רב-שכבתי שמציג שליטה מקצה לקצה.",
    includedInFree: false,
    highlightFlagship: true,
  },
];
