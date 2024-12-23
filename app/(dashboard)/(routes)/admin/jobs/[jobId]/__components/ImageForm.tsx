'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import ImageUpload from '@/components/ui/image-upload';

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: 'Image URL is required' }),
});

interface ImageFormProps {
  initialData: {
    imageUrl?: string;
  };
  jobId: string;
}

const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success('Job updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const toggleEditing = () => {
    setIsEditing((current) => !current);
    if (isEditing) {
      form.reset(initialData);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Image
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={field.onChange}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                variant="default"
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ImageForm;