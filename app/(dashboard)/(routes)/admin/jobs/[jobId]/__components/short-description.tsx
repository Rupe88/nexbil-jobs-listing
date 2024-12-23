'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Job } from '@prisma/client';

const formSchema = z.object({
  short_description: z.string().min(1),
});

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const ShortDescription = ({ initialData, jobId }: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      console.log(response);
      toast.success('Job Updated');
      toggleEditing();
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('something went wrong');
    }
  };

  const toggleEditing = () => {
    setIsEditing((current) => !current);
    if (isEditing) {
      form.reset({
        short_description: initialData?.short_description || '',
      });
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Short Description
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && <p className='text-neutral-500'>{initialData?.short_description}</p>}

      {isEditing && 
       <>
       <div className='flex items-center gap-2 my-2'>
<input type="text" placeholder='full stack developer' />

       </div>
       <p>Note*</p>
       <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>

       </>
      }
    </div>
  );
};

export default ShortDescription;
