import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from 'lucide-react';

const bannerVariant = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md shadow-md",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-300 text-primary",
        success: "bg-green-200/80 border-green-300 text-primary"
      }
    },
    defaultVariants: {
      variant: "warning"
    }
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle
} as const;

interface BannerProps extends VariantProps<typeof bannerVariant> {
  label: string;
}

const Banner = ({ variant, label }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariant({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </div>
  );
};

export default Banner;