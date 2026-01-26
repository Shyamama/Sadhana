import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sādhanā",
    short_name: "Sādhanā",
    description: "Pandit Mode guidance, daily practice, and journaling.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#7b4f2a",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ]
  };
}
