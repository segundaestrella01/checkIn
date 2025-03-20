# Daily Mood Check-In

A modern web application for tracking your daily moods and emotional well-being, with AI-powered reflective conversations and Notion integration.

## Features

- 📱 Progressive Web App (PWA) - Install on any device
- 🎯 Simple mood selection with emojis
- 🤖 AI-powered chat conversations to help you reflect on your emotions
- 📝 Automatic conversation summaries
- 📊 Notion integration for long-term mood tracking
- 🎨 Beautiful, responsive UI with smooth animations
- 🌙 Clean, modern design

## Getting Started

### Prerequisites

Before running the application, you'll need:

1. Node.js 16.14 or later
2. An OpenAI API key for the chat functionality
3. A Notion API key and database ID (optional, for mood tracking)

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Notion Database Setup (Optional)

If you want to use the Notion integration:

1. Create a new Notion database with the following properties:
   - Name (title)
   - Emoji (rich text)
   - Date (date)
2. Share the database with your integration
3. Configure your Notion credentials in the app settings

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Mood Selection**: Choose from a variety of moods that best represents how you're feeling
2. **AI Conversation**: After selecting your mood, engage in a reflective conversation with an AI counselor
3. **Smart Summary**: When ending the session, the AI provides a concise summary of your conversation
4. **Notion Integration**: Your mood and reflection are automatically saved to your Notion database (if configured)

## Development

The project uses:
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- OpenAI API for chat functionality
- Notion API for data storage
- PWA capabilities for install-ability

## Deployment

Deploy on Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcheckin-next)

Remember to set up your environment variables in your Vercel project settings:
- `OPENAI_API_KEY`

## License

MIT License - feel free to use this project for your own purposes.
