import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Initialize Notion client with API key from request
const getNotionClient = (apiKey: string) => {
  return new Client({ auth: apiKey });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, apiKey, databaseId, data } = body;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "API key and database ID are required" },
        { status: 400 }
      );
    }

    const notion = getNotionClient(apiKey);

    switch (action) {
      case 'saveMood':
        if (!data) {
          return NextResponse.json(
            { error: "Mood data is required" },
            { status: 400 }
          );
        }
        
        const response = await notion.pages.create({
          parent: {
            database_id: databaseId,
          },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: data.mood
                  }
                }
              ]
            },
            Emoji: {
              rich_text: [
                {
                  text: {
                    content: data.emoji
                  }
                }
              ]
            },
            Date: {
              date: {
                start: data.date.split('T')[0],
              }
            }
          }
        });

        return NextResponse.json(response);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing Notion request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}