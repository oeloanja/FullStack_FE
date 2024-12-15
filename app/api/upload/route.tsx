import { NextRequest, NextResponse } from 'next/server';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('환경 변수 AWS_S3_BUCKET_NAME이 설정되지 않았습니다.');
    }

    const params = {
      Bucket: bucketName,
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    const upload = await s3.upload(params).promise();
    
    return NextResponse.json({ url: upload.Location });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}