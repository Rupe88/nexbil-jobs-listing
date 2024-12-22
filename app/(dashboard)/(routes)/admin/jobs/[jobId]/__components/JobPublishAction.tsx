'use client';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);


  const onCLick=async()=>{


  }

  const onDelete=async()=>{

  }
  return (
    <div className="flex items-center gap-x-3 ">
      <Button variant={'outline'} disabled={disabled || isLoading} size={"sm"} onClick={onCLick}>
        {isPublished ? 'isPublished' : 'Published'}
      </Button>

      <Button variant={"destructive" } size={"icon"} disabled={isLoading} onClick={onDelete}>

        <Trash className='w-4 h-4'/>
      </Button>
    </div>
  );
};

export default JobPublishAction;
