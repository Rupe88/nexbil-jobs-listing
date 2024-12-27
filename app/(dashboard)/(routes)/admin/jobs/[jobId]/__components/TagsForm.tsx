'use client';

import { Lightbulb, Loader2, Pencil, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Job } from '@prisma/client';
import getGenerativeAIResponse from '@/scripts/ai-studio';

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEditing = () => setIsEditing(current => !current);

  const cleanAndParseResponse = (response: string): string[] => {
    try {
      const jsonArray = response.substring(
        response.indexOf('['),
        response.lastIndexOf(']') + 1
      );
      const parsed = JSON.parse(jsonArray);
      
      if (!Array.isArray(parsed) || !parsed.every(item => typeof item === 'string')) {
        throw new Error('Invalid response format');
      }
      
      return parsed;
    } catch (error) {
      console.error('Parsing error:', error);
      throw new Error('Failed to parse tags');
    }
  };

  const handlePromptGeneration = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error('Please enter a job profession');
      return;
    }

    try {
      setIsPrompting(true);
      const prompt = `Generate an array of exactly 10 keywords for a ${trimmedPrompt} position. Return only a JSON array of strings like this: ["keyword1", "keyword2", "keyword3"]. No other text or explanation.`;

      const response = await getGenerativeAIResponse(prompt);

      const parsedTags = typeof response === 'string' 
        ? cleanAndParseResponse(response)
        : response;

      if (!Array.isArray(parsedTags) || !parsedTags.every(tag => typeof tag === 'string')) {
        throw new Error('Invalid tags format');
      }

      setJobTags(parsedTags);
      toast.success('Tags generated successfully');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate tags');
    } finally {
      setIsPrompting(false);
    }
  };

  const handleTagRemove = (index: number) => {
    setJobTags(current => current.filter((_, i) => i !== index));
  };

  const handleClearTags = () => {
    setJobTags([]);
    toast.success('Tags cleared');
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: jobTags }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tags');
      }

      toast.success('Tags saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save tags');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isPrompting) {
      handlePromptGeneration();
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button 
          onClick={toggleEditing} 
          variant="ghost"
          disabled={isSubmitting}
        >
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {jobTags.length > 0 ? (
            jobTags.map((tag, index) => (
              <div
                key={index}
                className="text-xs bg-purple-100 rounded-md px-2 py-1"
              >
                {tag}
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No tags added yet</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mt-2">
            <input
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              placeholder="Enter job profession (e.g., full stack developer)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isPrompting}
            />
            <Button 
              disabled={isPrompting} 
              onClick={handlePromptGeneration}
              className="min-w-[40px]"
            >
              {isPrompting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-right">
            Press Enter or click the lightbulb to generate tags
          </p>

          <div className="flex flex-wrap gap-2">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap px-2 py-1 bg-purple-100 rounded-md"
                >
                  {tag}
                  <Button
                    className="p-0 h-auto hover:bg-transparent"
                    onClick={() => handleTagRemove(index)}
                    variant="ghost"
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No tags</p>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || jobTags.length === 0}
              onClick={handleClearTags}
            >
              Clear all
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsForm;