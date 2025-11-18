import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';

// GET - Fetch a page by slug and locale (public API)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    await connectDB();

    const page = await Page.findOne({
      slug,
      locale,
      isActive: true,
      deletedAt: null,
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('Fetch page error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

