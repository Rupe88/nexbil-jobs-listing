'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb, Loader2, Pencil } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import getGenerativeAIResponse from '@/scripts/ai-studio';

const formSchema = z.object({
  short_description: z.string().min(1),
});

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const ShortDescription = ({ initialData, jobId }: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPropmt] = useState('');
  const [isPrompting, setIsPropmting] = useState(false);

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

  const handlePromptGeneration = async () => {
    try {
      setIsPropmting(true);
      const customPrompt = `could you please craft a concise job description for a ${prompt} position in lower than 400 characters?`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        form.setValue("short_description", data)
        setIsPropmting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error('something went wrong');
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

      {!isEditing && (
        <p className="text-neutral-500">{initialData?.short_description}</p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              className="w-full p-2 rounded-md"
              type="text"
              placeholder="full stack developer"
              value={prompt}
              onChange={(e) => setPropmt(e.target.value)}
            />

            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w-4 h-4 " />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note* Profession Name alone enough to generate the tags
          </p>
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
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="short description about the job"
                        {...field}
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
        </>
      )}
    </div>
  );
};

export default ShortDescription;
