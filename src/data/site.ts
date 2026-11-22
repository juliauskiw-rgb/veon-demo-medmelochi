// All facts come from veon/client.json (company.contacts, products_services, W-F005…W-F008, business_lines).
// Nothing here is invented: no prices, ratings or reviews.

export const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
export const asset = (path: string): string => base + path.replace(/^\//, "");

export const brand = "MEDmelochi";

export const phones = [
  { label: "Безкоштовна лінія", display: "0 800 33-96-19", href: "tel:0800339619", note: "по Україні безкоштовно" },
  { label: "Київський номер", display: "+380 44 333-96-19", href: "tel:+380443339619", note: "міський, Київ" },
  { label: "Адміністрація", display: "+380 73 426-65-70", href: "tel:+380734266570", note: "питання до адміністрації" },
] as const;

export const mainPhone = phones[0];

export const email = "Med.melochi@gmail.com";

const mail = (subject: string, body: string): string =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const mailStock = mail(
  "Запит наявності та ціни",
  "Перелік позицій (назва / код / кількість):\n\n\nМісто доставки:\nТелефон:\n",
);

export const mailDealer = mail(
  "Запит дилерського прайсу",
  "Назва компанії / клініки:\nЩо цікавить (опт, дропшипінг, реалізація):\nТелефон:\n",
);

export const address = {
  line1: "вул. Тернопільська, 10, прим. 142",
  line2: "с. Петропавлівська Борщагівка, Київська область",
  map: "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("вул. Тернопільська, 10, Петропавлівська Борщагівка, Київська область"),
};

// W-F007 (hours from the homepage; weekend hours differ on the delivery page — client decision R-UX-05).
export const hours = [
  { days: "Понеділок–пʼятниця", short: "Пн–Пт", open: "09:00", close: "18:00" },
  { days: "Субота–неділя", short: "Сб–Нд", open: "09:00", close: "15:00" },
] as const;

export type Dir = "surgery" | "consumables" | "lab" | "vet";

export const directions: { id: Dir; name: string; short: string }[] = [
  { id: "surgery", name: "Хірургія", short: "Хірургія" },
  { id: "consumables", name: "Витратні та інʼєкції", short: "Витратні" },
  { id: "lab", name: "Лабораторія й обладнання", short: "Лабораторія" },
  { id: "vet", name: "Для тварин", short: "Для тварин" },
];

export interface Category {
  name: string;
  count: number;
  dir: Dir;
  img: string;
  w: number;
  h: number;
  size: "xl" | "l" | "m";
}

// Order = visual order of the tray (row by row). Sizes are steps by item count (concept §8.5).
export const categories: Category[] = [
  { name: "Витратні матеріали", count: 719, dir: "consumables", img: "vitratni", w: 480, h: 480, size: "xl" },
  { name: "Хірургічні інструменти", count: 427, dir: "surgery", img: "hirurgichni", w: 480, h: 379, size: "l" },
  { name: "Шовний матеріал", count: 299, dir: "surgery", img: "shovnij", w: 480, h: 328, size: "l" },
  { name: "Прилади та обладнання", count: 252, dir: "lab", img: "priladi", w: 480, h: 383, size: "l" },
  { name: "Імпланти", count: 205, dir: "surgery", img: "implanti", w: 480, h: 233, size: "l" },
  { name: "Лабораторні товари", count: 180, dir: "lab", img: "laboratorni", w: 434, h: 480, size: "m" },
  { name: "Все для забору крові", count: 64, dir: "consumables", img: "zabir-krovi", w: 300, h: 192, size: "m" },
  { name: "Травматологічні інструменти", count: 113, dir: "surgery", img: "travmatologichni", w: 480, h: 231, size: "m" },
  { name: "Товари для тварин", count: 73, dir: "vet", img: "tvarini", w: 480, h: 407, size: "m" },
  { name: "Антисептики, дезрозчини", count: 30, dir: "consumables", img: "antiseptiki", w: 480, h: 347, size: "m" },
  { name: "Силове обладнання", count: 4, dir: "lab", img: "silove", w: 376, h: 383, size: "m" },
];

export const total = categories.reduce((s, c) => s + c.count, 0); // 2366 → «понад 2 300»

export const positions = (n: number): string => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "позиція";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "позиції";
  return "позицій";
};

export const soon = "Розділ у розробці";
