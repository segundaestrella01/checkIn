import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Initialize Notion client with API key from environment
const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("Notion API key is not configured");
  }
  return new Client({ auth: apiKey });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "Notion is not properly configured. Please check your environment variables." },
        { status: 500 }
      );
    }

    const notion = getNotionClient();

    switch (action) {
      case 'saveMood':
        if (!data) {
          return NextResponse.json(
            { error: "Mood data is required" },
            { status: 400 }
          );
        }
        console.log('Saving mood data to Notion:', data);
        // Create the main page first
        const pageResponse = await notion.pages.create({
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

        // If there's a reflection note, add it as a paragraph block
        if (data.reflectionNote) {
          await notion.blocks.children.append({
            block_id: pageResponse.id,
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: data.reflectionNote
                      }
                    }
                  ]
                }
              }
            ]
          });
        }
        console.log('Page created in Notion:', pageResponse);
        return NextResponse.json(pageResponse);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Notion API:', error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}