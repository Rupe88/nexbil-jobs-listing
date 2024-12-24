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
  workMode: z.string().min(1),
});

interface WorkModeFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  {
    value: 'remote',
    label: 'Remote',
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
  },
  {
    value: 'office',
    label: 'Office',
  },

];

const WorkModeForm = ({
  initialData,
  jobId,
}: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode || '',
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
        workMode: initialData?.workMode || '',
      });
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.workMode
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Mode
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
            !initialData?.workMode && 'text-neutral-500 italic'
          )}
        >
          {selectedOption?.label || 'No Timing added'}
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
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading="Work Mode"
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

export default WorkModeForm;