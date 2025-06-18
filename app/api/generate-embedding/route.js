// app/api/generate-embedding/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Call Azure OpenAI for embedding
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_EMBEDDING_DEPLOYMENT}/embeddings?api-version=2024-02-15-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          input: text.replace('\n', ' ').trim(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    // Return the embedding
    return NextResponse.json({
      embedding: data.data[0].embedding,
      dimension: data.data[0].embedding.length,
    });
  } catch (error) {
    console.error('Embedding generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate embedding',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
