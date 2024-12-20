'use client';

import { BookMarked, Compass, Home, List, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarRouteItem from './SidebarRouteItem';

// Admin routes
const adminRoute = [
  {
    icon: List,
    label: 'Jobs',
    href: '/admin/jobs',
  },
  {
    icon: Compass,
    label: 'Analytics',
    href: '/admin/analytics',
  },
];

// Guest routes
const guestRoutes = [
  {
    icon: Home,
    label: 'Home',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Search',
    href: '/search',
  },
  {
    icon: User,
    label: 'Profiles',
    href: '/user',
  },
  {
    icon: BookMarked,
    label: 'Saved-Jobs',
    href: '/saved-jobs',
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const routes = isAdminPage ? adminRoute : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItem
          key={route.href} // Use route.href as a unique key
          icon={route.icon} // Pass the icon prop
          label={route.label} // Pass the label prop
          href={route.href} // Pass the href prop
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
