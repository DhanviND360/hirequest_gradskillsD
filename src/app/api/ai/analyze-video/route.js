import { NextResponse } from 'next/server';
import { queryOpenRouter } from '@/lib/openrouter';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('video');

    if (!file) {
      return NextResponse.json({ error: 'No video uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const dataUrl = `data:video/webm;base64,${base64String}`;

    const prompt = `You are an expert AI communication coach. Analyze the following candidate video resume.
Return ONLY a valid JSON object with the following keys:
- "transcript": (string) The full transcript of what they said in the video.
- "summary": (string) A short summary of their profile based on the video.
- "scores": { "confidence": number, "communication": number, "grammar": number, "eye_contact": number, "enthusiasm": number, "professionalism": number, "overall": number } (All numbers out of 100)
- "behaviors": (array of strings) Positive behaviors observed.
- "improvements": (array of strings) Areas for improvement.`;

    // Mocking response to avoid API key requirements
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing

    const parsedData = {
      transcript: "Hi, I'm very excited about this opportunity. I have been working as a software engineer for 3 years, primarily with React and Node.js. I love building scalable applications and I am always eager to learn new technologies.",
      summary: "A passionate software engineer with 3 years of experience in React and Node.js, eager to contribute and learn.",
      scores: {
        confidence: 85,
        communication: 90,
        grammar: 88,
        eye_contact: 80,
        enthusiasm: 95,
        professionalism: 90,
        overall: 88
      },
      behaviors: [
        "Maintained good eye contact",
        "Spoke clearly and confidently",
        "Showed genuine enthusiasm for the role"
      ],
      improvements: [
        "Could elaborate more on specific past projects",
        "Pacing was slightly fast at the beginning"
      ]
    };

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze video' }, { status: 500 });
  }
}
