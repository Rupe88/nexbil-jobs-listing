import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        // Base styles
        "relative w-full flex items-center rounded-lg mx-2 mb-1",
        "transition-all duration-200 ease-in-out",
        "group hover:bg-slate-100 dark:hover:bg-slate-800",
        
        // Text styles
        "text-sm font-medium",
        "text-slate-600 dark:text-slate-300",
        "hover:text-slate-900 dark:hover:text-slate-100",
        
        // Active state styles
        isActive && [
          "bg-primary/10",
          "text-primary hover:text-primary",
          "dark:bg-primary/20 dark:text-primary-foreground"
        ]
      )}
    >
      {/* Content wrapper */}
      <div className="flex items-center gap-x-3 py-3 px-4 w-full">
        {/* Icon with animated hover state */}
        <div className={clsx(
          "transition-transform duration-200",
          "group-hover:scale-110",
          isActive && "text-primary"
        )}>
          <Icon size={20} />
        </div>

        {/* Label */}
        <span className="font-medium">{label}</span>
      </div>

      {/* Active indicator line */}
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
      )}

      {/* Hover indicator - subtle background glow */}
      <div className={clsx(
        "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200",
        "group-hover:opacity-100",
        "bg-gradient-to-r from-transparent via-primary/5 to-transparent"
      )} />
    </button>
  );
};

export default SidebarRouteItem;