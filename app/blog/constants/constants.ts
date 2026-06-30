export const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Wardrobe Essentials for the Modern Minimalist",
    description:
      "Discover the foundational pieces that will elevate your everyday style and outlast fleeting micro-trends.",
    date: "June 15, 2026",
    category: "Style Guide",
  },
  {
    id: 2,
    title: "Sustainable Fashion: Behind Our Supply Chain",
    description:
      "Take a deep dive into our commitment to eco-friendly materials, water conservation, and ethical manufacturing.",
    date: "May 28, 2026",
    category: "Company News",
  },
  {
    id: 3,
    title: "Mastering the Art of Oversized Proportions",
    description:
      "Oversized doesn't mean messy. Learn how to balance baggy fits with structured layers for a perfect silhouette.",
    date: "April 10, 2026",
    category: "Editorials",
  },
];

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

export interface BlogPostDetail {
  id: number | string;
  title: string;
  category: string;
  date: string;
  author: string;
  authorRole?: string;
  featuredImage?: string;
  content: ContentBlock[];
}

// Mock data
export const BLOG_POSTS_DATA: BlogPostDetail[] = [
  {
    id: 1,
    title: "10 Wardrobe Essentials for the Modern Minimalist",
    category: "Style Guide",
    date: "June 15, 2026",
    author: "Elena Rossi",
    authorRole: "Head Stylist",
    featuredImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: [
      {
        type: "paragraph",
        text: "Building a functional wardrobe doesn't mean owning a lot of clothes; it means owning the right ones. The modern minimalist approach is about selecting versatile pieces that can be seamlessly mixed and matched.",
      },
      {
        type: "h3",
        text: "1. The Crisp White Tee",
      },
      {
        type: "paragraph",
        text: "It sounds basic because it is. A high-quality, mid-weight cotton t-shirt is the foundation of any good outfit. Look for one with a structured collar that holds its shape after multiple washes.",
      },
      {
        type: "h4",
        text: "2. The Unstructured Blazer",
      },
      {
        type: "paragraph",
        text: "Ditch the stiff shoulder pads. An unstructured blazer offers the polished look of tailoring but feels as comfortable as a cardigan. It effortlessly bridges the gap between casual and formal.",
      },
      {
        type: "blockquote",
        text: "True style is about subtraction. Once you strip away the excess, what remains must be perfectly executed.",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "A minimalist wardrobe rack",
      },
    ],
  },
  {
    id: 2,
    title: "Sustainable Fashion: Behind Our Supply Chain",
    category: "Company News",
    date: "May 28, 2026",
    author: "Marcus Chen",
    authorRole: "Sustainability Director",
    featuredImage:
      "https://images.unsplash.com/photo-1573879500655-98f2012dd1db?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: [
      {
        type: "paragraph",
        text: "We believe transparency is the first step toward sustainability. Today, we are opening the doors to our supply chain to show you exactly how your favorite garments are made.",
      },
      {
        type: "h3",
        text: "Water Conservation",
      },
      {
        type: "paragraph",
        text: "Traditional denim dyeing requires thousands of gallons of water. By switching to ozone washing and laser finishing in our European facilities, we have reduced our water consumption by 74% per pair of jeans.",
      },
    ],
  },
  {
    id: 3,
    title: "Mastering the Art of Oversized Proportions",
    category: "Editorials",
    date: "April 10, 2026",
    author: "Sarah Jenkins",
    authorRole: "Lead Designer",
    featuredImage:
      "https://images.unsplash.com/photo-1613461920867-9ea115fee900?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: [
      {
        type: "paragraph",
        text: "Oversized clothing has moved from a fleeting trend to a permanent fixture in modern streetwear. However, there is a fine line between looking effortlessly relaxed and simply wearing clothes that don't fit.",
      },
      {
        type: "h3",
        text: "The Rule of Balance",
      },
      {
        type: "paragraph",
        text: "If you are wearing an oversized, boxy hoodie, pair it with a more structured, straight-leg trouser. If your pants are incredibly baggy, opt for a slightly cropped or fitted upper garment to define your waistline.",
      },
    ],
  },
  {
    id: "fw26-lookbook",
    title: "The Fall/Winter 2026 Lookbook is Here",
    category: "Featured Collection",
    date: "August 1, 2026",
    author: "ClothingCo. Editorial Team",
    authorRole: "",
    featuredImage: "",
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
];
