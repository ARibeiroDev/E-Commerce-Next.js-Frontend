export type ContentBlockType =
  | "paragraph"
  | "h3"
  | "h4"
  | "blockquote"
  | "image";

export interface ContentBlock {
  type: ContentBlockType;
  text?: string;
  url?: string;
  alt?: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  authorRole?: string;
  featuredImage?: string;
  isFeatured?: boolean;
  content: ContentBlock[];
}

// Mock data for blog posts
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "fw26-lookbook",
    title: "The Fall/Winter 2026 Lookbook is Here",
    description:
      "Explore our new collection featuring heavy knits, weather-resistant outerwear, and the introduction of our new earth-tone color palette.",
    category: "Featured Collection",
    date: "July 1, 2026",
    author: "ClothingCo. Editorial Team",
    isFeatured: true,
    content: [
      {
        type: "paragraph",
        text: "As the days grow shorter and the air turns crisp, our wardrobes must adapt. The Fall/Winter 2026 collection is a study in texture, warmth, and resilience.",
      },
      {
        type: "h3",
        text: "Earth Tones & Heavy Knits",
      },
      {
        type: "paragraph",
        text: "This season, we are leaning heavily into rich charcoals, deep olive greens, and warm rust tones. Expect chunky merino wool sweaters and weather-resistant outerwear designed to withstand the elements without compromising on silhouette.",
      },
    ],
  },
  {
    id: 1,
    title: "10 Wardrobe Essentials for the Modern Minimalist",
    description:
      "Discover the foundational pieces that will elevate your everyday style and outlast fleeting micro-trends.",
    category: "Style Guide",
    date: "June 15, 2026",
    author: "Elena Rossi",
    authorRole: "Head Stylist",
    featuredImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1074&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "Building a functional wardrobe doesn't mean owning a lot of clothes; it means owning the right ones...",
      },
    ],
  },
  {
    id: 2,
    title: "Sustainable Fashion: Behind Our Supply Chain",
    description:
      "Take a deep dive into our commitment to eco-friendly materials, water conservation, and ethical manufacturing.",
    category: "Company News",
    date: "May 28, 2026",
    author: "Marcus Chen",
    authorRole: "Sustainability Director",
    featuredImage:
      "https://images.unsplash.com/photo-1573879500655-98f2012dd1db?q=80&w=870&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "We believe transparency is the first step toward sustainability...",
      },
    ],
  },
  {
    id: 3,
    title: "Mastering the Art of Oversized Proportions",
    description:
      "Oversized doesn't mean messy. Learn how to balance baggy fits with structured layers for a perfect silhouette.",
    category: "Editorials",
    date: "April 10, 2026",
    author: "Sarah Jenkins",
    authorRole: "Lead Designer",
    featuredImage:
      "https://images.unsplash.com/photo-1613461920867-9ea115fee900?q=80&w=774&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "Oversized clothing has moved from a fleeting trend to a permanent fixture...",
      },
    ],
  },
];
