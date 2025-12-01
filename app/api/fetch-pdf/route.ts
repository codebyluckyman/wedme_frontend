import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  console.log('URL:', url);

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Fetch the PDF from the external URL
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch the PDF' },
        { status: response.status }
      );
    }

    // Read the response as an array buffer
    const data = await response.arrayBuffer();

    // Set headers to indicate the content type and disposition
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'inline; filename=document.pdf');

    return new NextResponse(Buffer.from(data), { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching the PDF' },
      { status: 500 }
    );
  }
}
