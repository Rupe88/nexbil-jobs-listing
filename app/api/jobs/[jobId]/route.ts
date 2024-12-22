// app/api/jobs/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Change from 'export const POST' to 'export async function POST'
export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!jobId) {
      return new NextResponse('Id is missing', { status: 400 });
    }

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log('[JOBS_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
