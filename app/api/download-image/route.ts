import { type NextRequest, NextResponse } from 'next/server';

/**
 * Server-side route handler for downloading images
 * This is an alternative approach if client-side fetching has CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to download image: ${response.statusText}` },
        { status: 500 }
      );
    }

    // Get the image as an array buffer
    const imageBuffer = await response.arrayBuffer();

    return NextResponse.json({
      success: true,
      data: Buffer.from(imageBuffer).toString('base64'),
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
}
