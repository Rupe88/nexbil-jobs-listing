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
// import { Textarea } from '@/components/ui/textarea';
import getGenerativeAIResponse from '@/scripts/ai-studio';
import { Editor } from '@/components/ui/editor';

const formSchema = z.object({
  description: z.string().min(1),
});

interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aiValue, setAiValue] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [skills, setSkills] = useState('');

  const [isPrompting, setIsPropmting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
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
        description: initialData?.description || '',
      });
    }
  };

  const handlePromptGeneration = async () => {
    try {
      setIsPropmting(true);
      const customPrompt = `Could you please draft a job requirements document for the position of ${roleName}? The job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to job. Thanks!`;
    
    await getGenerativeAIResponse(customPrompt).then((data)=>{
      console.log(data)
      data=data.replace(/^'|'$/g, "")
      const cleanedText=data.replace(/[\*\[\]]/g, "");
      form.setValue("description", cleanedText)
      
      // console.log(cleanedText)
      setIsPropmting(false)
    })
    } catch (error) {
      console.log(error);
      toast.error('something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
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
        <p className="text-neutral-500">{initialData?.description}</p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              className="w-full p-2 rounded-md"
              type="text"
              placeholder="full stack developer"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            <input
              className="w-full p-2 rounded-md"
              type="text"
              placeholder="Required skills set"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
            Note* Profession Name and required skills
          </p>

          {aiValue && (

            <div calssName="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-400">
              {aiValue}

            </div>


          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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

export default JobDescription;
