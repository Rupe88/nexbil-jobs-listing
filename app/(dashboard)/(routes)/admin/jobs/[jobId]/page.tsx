import JobPublishAction from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/__components/JobPublishAction';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Banner from '@/components/ui/banner';
import { IconBadge } from '@/components/ui/icon-badge';
import TitleForm from './__components/TitleForm';
import CategoryForm from './__components/CategoryForm';
import ImageForm from './__components/ImageForm';
import ShortDescription from './__components/short-description';
import HourlyRateForm from './__components/HourlyRateForm';
import ShiftTimingMode from './__components/ShiftTimingMode copy';
import WorkModeForm from './__components/WorkModeForm';
import WorkExperienceForm from './__components/WorkExperienceForm';
const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  //verify the mongodb id
  const validObjectRegex = /^[a-f\d]{24}$/i;
  if (!validObjectRegex.test(params.jobId)) {
    return redirect('/admin/jobs');
  }
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
  });
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  console.log('found category', categories);

  if (!job) {
    return redirect('/admin/jobs');
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={'/admin/jobs'}>
        <div className="flex items-center text-sm text-center text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Job SetUp</h1>
          <span className="text-sm text-neutral-500">
            Complete all Fields {completionText}
          </span>
        </div>

        {/* actions button */}

        <JobPublishAction
          jobId={params.jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* warning before publishing the code  */}

      {!job.isPublished && (
        <Banner
          variant={'warning'}
          label="This job is unpublished. it will not be visible in the job list"
        />
      )}

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          {/* title */}
          <div className="flex gap-x-2 items-center">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>
          {/* title form  */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* category form  */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => {
              return {
                label: category.name,
                value: category.id,
              };
            })}
          />

          {/* image form */}
          <ImageForm initialData={job} jobId={job.id} />

          {/* short description  */}
          <ShortDescription initialData={job} jobId={job.id} />

          {/* shift timing */}

          <ShiftTimingMode initialData={job} jobId={job.id} />

          {/* hourly rate  */}
          <HourlyRateForm initialData={job} jobId={job.id} />

          {/* work mode form  */}

          <WorkModeForm initialData={job} jobId={job.id} />

          {/* work experience form */}

          <WorkExperienceForm initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
