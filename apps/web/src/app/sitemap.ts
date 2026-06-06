import type { MetadataRoute } from "next";
import { navItems, projects, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...navItems.map((item) => item.href)];
  const projectRoutes = projects.map((project) => `/portfolio/${project.slug}`);

  return [...routes, ...projectRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
