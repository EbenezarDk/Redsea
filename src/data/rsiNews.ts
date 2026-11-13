/**
 * Homepage Newsroom placeholders only.
 * Do not treat as real RSI publications.
 */

export type RsiNewsItem = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  isPlaceholder: true;
  /** Verified URL when real articles are approved. */
  href?: string;
};

export const rsiNewsSection = {
  eyebrow: "LATEST FROM RSI",
  title: "News & Insights",
  description: "Explore the latest stories and updates from Red Sea International.",
  previewNote: "Preview only — placeholder editorial content. Not a published RSI article.",
  /** Initial visible count; array may hold up to 6. */
  initialCount: 4,
  maxCount: 6,
} as const;

export const rsiNews: RsiNewsItem[] = [
  {
    id: "news-01",
    category: "COMPANY NEWS",
    title: "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/images/rsi/sunset-modular-cityscape.png",
    imageAlt: "Placeholder architectural study — not an RSI news photograph",
    isPlaceholder: true,
  },
  {
    id: "news-02",
    category: "PROJECT UPDATES",
    title: "Sed Ut Perspiciatis Unde Omnis Iste Natus Error",
    excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    image: "/images/rsi/capability-build.png",
    imageAlt: "Placeholder infrastructure study — not an RSI news photograph",
    isPlaceholder: true,
  },
  {
    id: "news-03",
    category: "INSIGHTS",
    title: "Nemo Enim Ipsam Voluptatem Quia Voluptas Sit Aspernatur",
    excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
    image: "/images/rsi/capability-design.png",
    imageAlt: "Placeholder design study — not an RSI news photograph",
    isPlaceholder: true,
  },
  {
    id: "news-04",
    category: "MEDIA",
    title: "Ut Enim Ad Minima Veniam Quis Nostrum Exercitationem",
    excerpt: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.",
    image: "/images/rsi/about-factory.jpg",
    imageAlt: "Placeholder factory study — not an RSI news photograph",
    isPlaceholder: true,
  },
  {
    id: "news-05",
    category: "COMPANY NEWS",
    title: "Quis Autem Vel Eum Iure Reprehenderit Qui In Ea",
    excerpt: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
    image: "/images/rsi/luxury-glass-office-sunset.png",
    imageAlt: "Placeholder corporate interior study — not an RSI news photograph",
    isPlaceholder: true,
  },
  {
    id: "news-06",
    category: "PROJECT UPDATES",
    title: "At Vero Eos Et Accusamus Et Iusto Odio Dignissimos",
    excerpt: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
    image: "/images/rsi/business-housing.jpg",
    imageAlt: "Placeholder modular construction study — not an RSI news photograph",
    isPlaceholder: true,
  },
];

export const visibleRsiNews = rsiNews.slice(0, rsiNewsSection.maxCount);
