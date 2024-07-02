import _ from 'lodash';
import mime from 'mime';
import {join} from 'path';
import {PrismaClient} from '@prisma/client/extension';
import {stat, mkdir, writeFile} from 'fs/promises';
import {NextRequest, NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const image = formData.get('imageFile') as File;

  const buffer = Buffer.from(await image.arrayBuffer());
  const relativeUploadDir = '/images';

  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

  try {
    // Check if the directory exists
    await stat(uploadDir);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // ENOEND stands for Error NO ENtry
      // If the directory does not exist create it
      await mkdir(uploadDir, {recursive: true});
    } else {
      return NextResponse.json(
        {success: false, error: 'Something went wrong: ' + error.message},
        {status: 500}
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${name
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')}-${uniqueSuffix}.${mime.getExtension(
      image.type
    )}`;

    const imageUrl = `${relativeUploadDir}/${filename}`;

    // create database record
    await prisma.khodam.create({
      data: {
        name,
        description,
        image_link: imageUrl,
        created_at: new Date(),
      },
    });

    // the reason that we put this piece of code here it's so that
    //
    await writeFile(`${uploadDir}/${filename}`, buffer);

    return NextResponse.json({
      success: true,
      message: 'Successfully created khodam ' + name + '!',
    });
  } catch (error: any) {
    return NextResponse.json(
      {success: false, error: 'Something went wrong: ' + error.message},
      {status: 500}
    );
  }
}
