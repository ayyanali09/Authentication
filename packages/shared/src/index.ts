export const SERVICES = [
  "Website Development",
  "Mobile App Development",
  "UI/UX Design",
  "Problem Solving & Consulting",
  "Custom Software Solutions",
  "Marketing & Sales Support"
] as const;

export const PROJECT_CATEGORIES = [
  "Website",
  "Mobile App",
  "UI/UX",
  "Software",
  "Consulting",
  "Marketing"
] as const;

export type ServiceName = (typeof SERVICES)[number];
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type Metric = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  summary: string;
  client: string;
  year: string;
  coverImage: string;
  heroImage?: string;
  tags: string[];
  services: ServiceName[];
  metrics: Metric[];
  challenge: string;
  solution: string;
  results: string[];
  featured: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
};

export type Testimonial = {
  id: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarImage?: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  service: ServiceName;
  budget?: string;
  message: string;
};
