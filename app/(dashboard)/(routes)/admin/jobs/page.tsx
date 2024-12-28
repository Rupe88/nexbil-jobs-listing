import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { columns, JobsColumn } from './[jobId]/__components/columns';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import {format} from "date-fns"
const JobsPageOverview = async() => {

  const {userId}=await auth();

  if(!userId){
    return redirect("/")
  }


const jobs=await db.job.findMany({
where:{
  userId
},
include:{
  category:true
},
orderBy:{
  createdAt:"desc"
}

})
// console.log(jobs)

const formatedJobs:JobsColumn[]=jobs.map((job)=>({
  id:job.id,
  title:job.title,
  company:"",
  isPublished:job.isPublished,
  category:job.category ? job.category?.name : "N/A",
  createdAt: job.createdAt ? format(job.createdAt.toLocaleDateString(), "MMM do, yyyy" ): "N/A" 
}))


  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={'/admin/create'}>
          <Button>
            <Plus className='w-5 h-5'/>
            New Job</Button>
        </Link>
      </div>

      {/* datatable list of jobs */}
      <div className="mt-6">
        <DataTable columns={columns} data={formatedJobs}/>
      </div>


    </div>
  );
};

export default JobsPageOverview;
