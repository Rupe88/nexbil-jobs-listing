'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type JobsColumn = {
  id: string;
  title: string;
  company: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
};

export const columns: ColumnDef<JobsColumn>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'isPublished',
    header: 'Published',
    cell: ({ row }) => {
      const { isPublished } = row.original;
      return (
        <div
          className={cn(
            'border px-2 py-1 text-xs rounded-md w-24 text-center',
            isPublished
              ? 'border-green-500 bg-green-100/80'
              : 'border-red-500 bg-red-100/80'
          )}
        >
          {isPublished ? 'Published' : 'Unpublished'}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} size={'icon'}>
                <MoreHorizontal className="h-4 w-4 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/admin/jobs/${id}`}>
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" />
                  edit
                </DropdownMenuItem>
              </Link>

              <Link href={`/admin/jobs/${id}/applicants`}>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  applicants
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
