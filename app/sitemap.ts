import type { MetadataRoute } from "next"

const BASE_URL = "https://hudyat.com"

const staticRoutes = [
  "/",
  "/about",
  "/news",
  "/feature",
  "/editorial",
  "/opinion",
  "/literary",
  "/sports",
  "/newsroom",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }))
}
