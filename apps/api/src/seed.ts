import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { BlogPostModel } from "./models/BlogPost.js";
import { ContactMessageModel } from "./models/ContactMessage.js";
import { ProjectModel } from "./models/Project.js";
import { TestimonialModel } from "./models/Testimonial.js";
import { UserModel } from "./models/User.js";

async function seed() {
  await connectDatabase();

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);

  await UserModel.findOneAndUpdate(
    { email: env.SEED_ADMIN_EMAIL },
    {
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      passwordHash,
      role: "admin"
    },
    { upsert: true, new: true }
  );

  if ((await ProjectModel.countDocuments()) === 0) {
    await ProjectModel.insertMany([
      {
        title: "Commerce Website & Booking Platform",
        slug: "commerce-website-booking-platform",
        category: "Website",
        summary:
          "A modern website with product pages, inquiry flows, booking logic, and a cleaner customer journey.",
        client: "UrbanCart Studio",
        year: "2026",
        coverImage: "/images/project-neon-retail.png",
        heroImage: "/images/project-neon-retail.png",
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
        featured: true,
        published: true
      },
      {
        title: "Service App MVP",
        slug: "service-app-mvp",
        category: "Mobile App",
        summary:
          "A mobile-first MVP for customer accounts, service requests, notifications, and support workflows.",
        client: "OrbitCare",
        year: "2026",
        coverImage: "/images/project-content-studio.png",
        heroImage: "/images/project-content-studio.png",
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
        featured: true,
        published: true
      },
      {
        title: "Product UI System & UX Refresh",
        slug: "product-ui-system-ux-refresh",
        category: "UI/UX",
        summary:
          "A sharper interface system for a startup product with cleaner screens, reusable components, and easier user flows.",
        client: "LumaDesk",
        year: "2026",
        coverImage: "/images/project-content-studio.png",
        heroImage: "/images/project-content-studio.png",
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
        featured: true,
        published: true
      },
      {
        title: "Operations Dashboard & Automation",
        slug: "operations-dashboard-automation",
        category: "Software",
        summary:
          "An internal dashboard that brought leads, projects, status updates, and reporting into one cleaner system.",
        client: "ApexWorks",
        year: "2025",
        coverImage: "/images/project-launch-system.png",
        heroImage: "/images/project-launch-system.png",
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
        featured: true,
        published: true
      },
      {
        title: "Startup Growth Roadmap & Tech Audit",
        slug: "startup-growth-roadmap-tech-audit",
        category: "Consulting",
        summary:
          "A practical consulting sprint that turned unclear product, website, and workflow needs into a focused 90-day execution roadmap.",
        client: "NorthPeak Labs",
        year: "2026",
        coverImage: "/images/project-launch-system.png",
        heroImage: "/images/project-launch-system.png",
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
        featured: true,
        published: true
      },
      {
        title: "Launch Campaign & Lead Funnel",
        slug: "launch-campaign-lead-funnel",
        category: "Marketing",
        summary:
          "A startup launch funnel with offer messaging, landing pages, lead forms, and campaign assets built around qualified inquiries.",
        client: "BrightPath Studio",
        year: "2025",
        coverImage: "/images/blog-growth-systems.png",
        heroImage: "/images/blog-growth-systems.png",
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
        featured: true,
        published: true
      }
    ]);
  }

  if ((await BlogPostModel.countDocuments()) === 0) {
    await BlogPostModel.insertMany([
      {
        title: "How High-Growth Brands Build a Content Operating System",
        slug: "content-operating-system",
        excerpt:
          "The repeatable planning, production, and measurement loop behind modern content teams.",
        content:
          "A strong content program is not a calendar alone. It is a system of insight, production rhythm, distribution, and measurement. Start with audience problems, build repeatable formats, and use performance data to decide where creative energy goes next.",
        coverImage: "/images/blog-growth-systems.png",
        author: "Maya Chen",
        category: "Content Strategy",
        tags: ["Content", "Operations", "Growth"],
        readTime: "6 min read",
        status: "published",
        publishedAt: new Date()
      },
      {
        title: "Performance Creative Is the New Media Buying Advantage",
        slug: "performance-creative-advantage",
        excerpt:
          "Why modern paid media teams win by testing angles, offers, and formats faster.",
        content:
          "Auction mechanics still matter, but creative velocity is now the compounding edge. Brands that test messaging with discipline learn faster, lower CAC, and build a stronger library of proof points for future campaigns.",
        coverImage: "/images/blog-growth-systems.png",
        author: "Noah Reed",
        category: "Performance",
        tags: ["Paid Media", "Creative", "Testing"],
        readTime: "5 min read",
        status: "published",
        publishedAt: new Date()
      }
    ]);
  }

  if ((await TestimonialModel.countDocuments()) === 0) {
    await TestimonialModel.insertMany([
      {
        clientName: "Elena Moroz",
        role: "Founder",
        company: "UrbanCart Studio",
        quote:
          "DURON turned a rough idea into a professional website that finally made our business look ready for serious customers.",
        rating: 5,
        featured: true
      },
      {
        clientName: "Marcus Lane",
        role: "Operations Lead",
        company: "OrbitCare",
        quote:
          "They understood the workflow problem first, then designed the app around what customers and staff actually needed.",
        rating: 5,
        featured: true
      }
    ]);
  }

  if ((await ContactMessageModel.countDocuments()) === 0) {
    await ContactMessageModel.create({
      name: "Ariana Stone",
      email: "ariana@example.com",
      company: "Stone & Grid",
      service: "Website Development",
      budget: "$2,500 - $6,000",
      message:
        "We need a professional website with clear service pages, stronger lead flow, and a simple launch plan.",
      status: "new"
    });
  }

  await disconnectDatabase();
  console.log("Seed complete");
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
