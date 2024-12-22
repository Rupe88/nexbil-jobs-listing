// app/api/jobs/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Change from 'export const POST' to 'export async function POST'
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title) {
      return new NextResponse("Title is missing", { status: 400 });
    }

    const job = await db.job.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log("[JOBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}