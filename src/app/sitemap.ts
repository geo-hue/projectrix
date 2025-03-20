import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.projectrix.app';
  
  // Core pages
  const routes = [
    '',
    '/about',
    '/generate',
    '/ideas',
    '/pricing',
    '/feedback',
    '/profile',
    '/terms',
    '/privacy',
    '/collaborations',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}