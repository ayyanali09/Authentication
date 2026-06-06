import {
  PROJECT_CATEGORIES,
  SERVICES,
  type Project,
  type Testimonial
} from "@vantanova/shared";

export const site = {
  name: "DURON",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "A professional development agency building websites, mobile app experiences, UI/UX design systems, dashboards, automations, and business-ready digital solutions."
};

export const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" }
];

export const serviceOptions = SERVICES;
export const projectCategories = ["All", ...PROJECT_CATEGORIES] as const;

export const services = [
  {
    title: "Website Development",
    icon: "Code2",
    summary:
      "Fast, responsive business websites, landing pages, ecommerce fronts, and web apps built to convert visitors into customers.",
    outcomes: ["Next.js websites", "SEO foundations", "Conversion-focused pages"],
    pricing: {
      startingAt: "$1,500",
      range: "$1,500 - $6,000",
      note: "business sites, landing pages, and smaller ecommerce fronts"
    }
  },
  {
    title: "Mobile App Development",
    icon: "Smartphone",
    summary:
      "Mobile-first product experiences for iOS, Android, customer portals, booking flows, MVPs, and service apps.",
    outcomes: ["iOS-ready interfaces", "Cross-platform builds", "App launch guidance"],
    pricing: {
      startingAt: "$5,000",
      range: "$5,000 - $25,000",
      note: "simple MVPs and cross-platform app experiences"
    }
  },
  {
    title: "UI/UX Design",
    icon: "Palette",
    summary:
      "Professional interface design for websites, apps, dashboards, brand pages, and customer journeys.",
    outcomes: ["Wireframes", "High-fidelity UI", "Design systems"],
    pricing: {
      startingAt: "$750",
      range: "$750 - $4,000",
      note: "wireframes, key screens, prototypes, and design systems"
    }
  },
  {
    title: "Problem Solving & Consulting",
    icon: "Wrench",
    summary:
      "Clear technical planning for business problems, broken workflows, slow websites, unclear products, and messy digital operations.",
    outcomes: ["Technical audits", "Solution roadmaps", "Workflow fixes"],
    pricing: {
      startingAt: "$150",
      range: "$150 - $1,200",
      note: "strategy calls, audits, and practical execution roadmaps"
    }
  },
  {
    title: "Custom Software Solutions",
    icon: "Blocks",
    summary:
      "Dashboards, admin panels, automation tools, integrations, and internal systems designed around how your business actually works.",
    outcomes: ["Admin portals", "API integrations", "Automation tools"],
    pricing: {
      startingAt: "$2,500",
      range: "$2,500 - $12,000",
      note: "dashboards, automations, internal tools, and integrations"
    }
  },
  {
    title: "Marketing & Sales Support",
    icon: "Rocket",
    summary:
      "Launch copy, sales pages, lead forms, offer messaging, and customer-facing assets that help your digital product get attention.",
    outcomes: ["Landing pages", "Lead generation", "Offer messaging"],
    pricing: {
      startingAt: "$500",
      range: "$500 - $3,000",
      note: "launch pages, lead funnels, offer copy, and sales assets"
    }
  }
] as const;

export const stats = [
  { label: "Web and app builds", value: 42, suffix: "+" },
  { label: "Performance targets met", value: 96, suffix: "%" },
  { label: "Average first response", value: 24, suffix: "h" },
  { label: "Reusable components shipped", value: 180, suffix: "+" }
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Commerce Website & Booking Platform",
    slug: "commerce-website-booking-platform",
    category: "Website",
    summary:
      "A modern website with product pages, inquiry flows, booking logic, and a cleaner customer journey.",
    client: "UrbanCart Studio",
    year: "2026",
    coverImage: "/images/portfolio-website.jpg",
    heroImage: "/images/portfolio-website.jpg",
    tags: ["Next.js", "Ecommerce", "Booking Flow"],
    services: ["Website Development", "UI/UX Design", "Custom Software Solutions"],
    metrics: [
      { label: "Load Time", value: "0.9s" },
      { label: "Inquiry Lift", value: "+148%" },
      { label: "Admin Time Saved", value: "35%" }
    ],
    challenge:
      "The client needed a professional website that explained the offer clearly, handled booking requests, and made the business look credible online.",
    solution:
      "We planned the customer journey, designed the interface, built responsive pages, and connected the inquiry flow to a simple admin-ready process.",
    results: [
      "Created a faster website with clearer service pages.",
      "Improved the path from visitor interest to qualified inquiry.",
      "Reduced manual follow-up with structured booking information."
    ],
    featured: true
  },
  {
    id: "p2",
    title: "Service App MVP",
    slug: "service-app-mvp",
    category: "Mobile App",
    summary:
      "A mobile-first MVP for customer accounts, service requests, notifications, and support workflows.",
    client: "OrbitCare",
    year: "2026",
    coverImage: "/images/portfolio-mobile-app.jpg",
    heroImage: "/images/portfolio-mobile-app.jpg",
    tags: ["Mobile UX", "MVP", "Customer Portal"],
    services: ["Mobile App Development", "UI/UX Design", "Problem Solving & Consulting"],
    metrics: [
      { label: "MVP Timeline", value: "6w" },
      { label: "Task Completion", value: "+62%" },
      { label: "Support Load", value: "-28%" }
    ],
    challenge:
      "The business handled requests through scattered messages, spreadsheets, and manual updates that slowed the customer experience.",
    solution:
      "We mapped the workflow, designed a simple app experience, and shaped an MVP roadmap around the most important customer actions.",
    results: [
      "Defined the app structure and core user flows.",
      "Made request tracking easier for customers and staff.",
      "Created a scalable base for future app features."
    ],
    featured: true
  },
  {
    id: "p4",
    title: "Product UI System & UX Refresh",
    slug: "product-ui-system-ux-refresh",
    category: "UI/UX",
    summary:
      "A sharper interface system for a startup product with cleaner screens, reusable components, and easier user flows.",
    client: "LumaDesk",
    year: "2026",
    coverImage: "/images/portfolio-ui-ux.jpg",
    heroImage: "/images/portfolio-ui-ux.jpg",
    tags: ["Product Design", "UX Audit", "Design System"],
    services: ["UI/UX Design", "Problem Solving & Consulting", "Custom Software Solutions"],
    metrics: [
      { label: "Core Screens", value: "38" },
      { label: "User Flow Clarity", value: "+54%" },
      { label: "Design Debt Reduced", value: "31%" }
    ],
    challenge:
      "The startup had a useful product, but the interface felt inconsistent and made important customer actions harder than they needed to be.",
    solution:
      "We audited the product journey, redesigned the high-value screens, and created a reusable UI system that the team could extend without slowing down.",
    results: [
      "Created a more consistent product experience across core screens.",
      "Made onboarding, account setup, and key actions easier to complete.",
      "Gave the development team reusable components for future releases."
    ],
    featured: true
  },
  {
    id: "p3",
    title: "Operations Dashboard & Automation",
    slug: "operations-dashboard-automation",
    category: "Software",
    summary:
      "An internal dashboard that brought leads, projects, status updates, and reporting into one cleaner system.",
    client: "ApexWorks",
    year: "2025",
    coverImage: "/images/portfolio-software-development.jpg",
    heroImage: "/images/portfolio-software-development.jpg",
    tags: ["Dashboard", "Automation", "CRM"],
    services: ["Custom Software Solutions", "Problem Solving & Consulting", "Website Development"],
    metrics: [
      { label: "Manual Work Reduced", value: "41%" },
      { label: "Reporting Speed", value: "3x" },
      { label: "Data Visibility", value: "+76%" }
    ],
    challenge:
      "The team had important business data spread across tools, making it hard to see project status and customer follow-up in one place.",
    solution:
      "We designed a practical dashboard, structured the data model, and connected the key workflows into a cleaner operating view.",
    results: [
      "Gave the team one place to review active work.",
      "Reduced repeated manual updates across spreadsheets.",
      "Improved decision-making with clearer operational reporting."
    ],
    featured: true
  },
  {
    id: "p5",
    title: "Startup Growth Roadmap & Tech Audit",
    slug: "startup-growth-roadmap-tech-audit",
    category: "Consulting",
    summary:
      "A practical consulting sprint that turned unclear product, website, and workflow needs into a focused 90-day execution roadmap.",
    client: "NorthPeak Labs",
    year: "2026",
    coverImage: "/images/portfolio-business-consulting.jpg",
    heroImage: "/images/portfolio-business-consulting.jpg",
    tags: ["Tech Audit", "Roadmap", "Operations"],
    services: ["Problem Solving & Consulting", "Custom Software Solutions", "Website Development"],
    metrics: [
      { label: "Roadmap Window", value: "90d" },
      { label: "Tool Spend Cut", value: "18%" },
      { label: "Priority Clarity", value: "+64%" }
    ],
    challenge:
      "The founders were moving quickly, but their website priorities, software needs, and internal workflow problems were competing for attention.",
    solution:
      "We reviewed the current tools, mapped business bottlenecks, and shaped a practical roadmap that separated urgent fixes from future product work.",
    results: [
      "Defined the highest-impact website, product, and workflow priorities.",
      "Removed overlapping tools and simplified the operating stack.",
      "Created a build sequence the team could follow without guesswork."
    ],
    featured: true
  },
  {
    id: "p6",
    title: "Launch Campaign & Lead Funnel",
    slug: "launch-campaign-lead-funnel",
    category: "Marketing",
    summary:
      "A startup launch funnel with offer messaging, landing pages, lead forms, and campaign assets built around qualified inquiries.",
    client: "BrightPath Studio",
    year: "2025",
    coverImage: "/images/portfolio-digital-marketing.jpg",
    heroImage: "/images/portfolio-digital-marketing.jpg",
    tags: ["Lead Funnel", "Landing Page", "Offer Copy"],
    services: ["Marketing & Sales Support", "Website Development", "UI/UX Design"],
    metrics: [
      { label: "Lead Lift", value: "+132%" },
      { label: "Launch Assets", value: "14" },
      { label: "CPA Reduced", value: "22%" }
    ],
    challenge:
      "The business had a strong offer, but the launch message, campaign pages, and lead capture path were too scattered to convert consistently.",
    solution:
      "We clarified the offer, wrote conversion-focused page copy, designed the landing flow, and connected the campaign assets to a cleaner inquiry process.",
    results: [
      "Made the launch message easier for prospects to understand.",
      "Improved the path from campaign click to qualified lead.",
      "Gave the team reusable campaign assets for future launches."
    ],
    featured: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    clientName: "Elena Moroz",
    role: "Founder",
    company: "UrbanCart Studio",
    quote:
      "DURON turned a rough idea into a professional website that finally made our business look ready for serious customers.",
    rating: 5
  },
  {
    id: "t2",
    clientName: "Marcus Lane",
    role: "Operations Lead",
    company: "OrbitCare",
    quote:
      "They understood the workflow problem first, then designed the app around what customers and staff actually needed.",
    rating: 5
  },
  {
    id: "t3",
    clientName: "Priya Desai",
    role: "Managing Partner",
    company: "ApexWorks",
    quote:
      "The dashboard saved our team hours every week. The best part was how clearly they explained the solution before building it.",
    rating: 5
  }
];

export const team = [
  {
    name: "Syed Ayyan Ali",
    role: "Founder / CEO",
    focus: "Leads DURON with a clear focus on strategy, client direction, product quality, and strong digital execution.",
    image: "/images/syed-ayyan-ali-real.jpeg"
  },
  {
    name: "Talal Sheikh",
    role: "Co-Founder / Executive Director",
    focus: "Guides company operations, client relationships, brand communication, and growth planning across each project.",
    image: "/images/talal-sheikh-real.jpeg"
  },
  {
    name: "Anas Khan",
    role: "Web Developer",
    focus: "Builds clean, responsive web experiences with careful attention to structure, usability, and reliable delivery.",
    image: "/images/anas-khan-real.jpeg"
  },
  {
    name: "Hadi Khan",
    role: "Editor & Marketing",
    focus: "Supports editing, marketing execution, content quality, and clear brand presentation across client work.",
    image: "/images/hadi-khan-real.jpeg"
  }
];
