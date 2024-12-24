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
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combo-box';

const formSchema = z.object({
  yearOfExperience: z.string().min(1),
});

interface WorkModeFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  {
    value: '0',
    label: 'Fresher',
  },
  {
    value: '2',
    label: '0-2 years',
  },
  {
    value: '3',
    label: '2-4 years',
  },
  {
    value: '5',
    label: '5+ years',
  },
  {
    value: '5-10',
    label: '10+ years',
  },
];

const WorkExperienceForm = ({ initialData, jobId }: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearOfExperience: initialData?.yearOfExperience || '',
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
        yearOfExperience: initialData?.yearOfExperience || '',
      });
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.yearOfExperience
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Experience
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

      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData?.yearOfExperience && 'text-neutral-500 italic'
          )}
        >
          {selectedOption?.label || 'No Experience added'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading="Work Experience"
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
                    />
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
      )}
    </div>
  );
};

export default WorkExperienceForm;
