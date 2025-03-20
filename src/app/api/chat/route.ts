import { NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, isFirstMessage, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // System message to guide the assistant's behavior
    const systemMessage = {
      role: "system",
      content: `Rispondi come un terapista di terapia comportamentale cognitiva. Il paziente sta cercando di fare un lavoro sull'autostima e l'accettazione di se stesso. 
Il suo obbiettivo per il 2025 e' il seguente: "Entro dicembre 2025, ridurrò le autocritiche quotidiane da 5 a 2, rispondendo ad esse con almeno 3 affermazioni gentili. Mi impegnerò con pratiche di autocompassione, come meditazioni e un diario dei progressi, per costruire una crescita personale basata sull'accettazione."
In quest'ottica il paziente sta analizzando alla sera il suo stato emotivo alla fine della giornata. Ogni risposta non deve superare i 200 caratteri. Poni una domanda alla volta per approfondire il suo stato d'animo e supportarlo nel conseguimento del suo obbiettivo.`
    };

    // Prepare conversation history
    const messages = [
      systemMessage,
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    if (isFirstMessage) {
      messages[0].content += `\nQuesto e' il primo messaggio. Lo stato d'animo di oggi e': ${message}.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}