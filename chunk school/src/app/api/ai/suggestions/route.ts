import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, role, language } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Build the system prompt based on role
    const roleContext = role
      ? `The user's role is "${role}".`
      : 'The user is a student.';
    const languageInstruction = language
      ? `Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.`
      : 'Respond in the same language as the query.';

    // Use z-ai-web-dev-sdk for AI suggestions
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an educational advisor for Champs School, an Algerian educational platform that offers courses in languages (English, French, Arabic), mathematics, science, and digital arts. ${roleContext} ${languageInstruction} Provide helpful, concise, and actionable suggestions. If the question is unrelated to education, politely redirect the user to educational topics.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    });

    const suggestion = completion.choices?.[0]?.message?.content || 'No suggestion available.';

    return NextResponse.json({
      success: true,
      suggestion,
      query,
    });
  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
