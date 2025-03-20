import { NextResponse } from 'next/server';

export async function GET() {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  const isConfigured = Boolean(notionApiKey && notionDatabaseId);

  return NextResponse.json({ isConfigured });
}