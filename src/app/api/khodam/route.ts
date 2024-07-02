import {PrismaClient} from '@prisma/client';

import {NextRequest, NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.khodam.findMany();

    return NextResponse.json({success: true, data});
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong: ' + error.message,
      },
      {status: 500}
    );
  }
}
