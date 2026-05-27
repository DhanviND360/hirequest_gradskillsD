import { NextResponse } from 'next/server';
import { queryOpenRouter } from '@/lib/openrouter';

export async function POST(req) {
  try {
    const { candidateProfile, jobRequirements } = await req.json();

    const prompt = `You are an expert AI recruitment matchmaking algorithm.
Calculate the match percentage between this candidate and the job requirements.

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job Requirements:
${JSON.stringify(jobRequirements, null, 2)}

Return ONLY a valid JSON object with the following keys:
- "matchScore": (number 0-100) The overall match percentage.
- "reasoning": (string) A concise 2-sentence explanation of why they are a good or bad fit.
- "missingSkills": (array of strings) Important skills the candidate lacks.`;

    // Mocking response to avoid API key requirements
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

    const parsedData = {
      matchScore: Math.floor(Math.random() * 40) + 60, // random score between 60 and 99
      reasoning: "The candidate's technical skills strongly align with the core requirements. However, more domain-specific experience would elevate their profile.",
      missingSkills: ["Cloud Infrastructure", "Advanced System Design"]
    };

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in matchmaking:', error);
    return NextResponse.json({ error: error.message || 'Failed to calculate match' }, { status: 500 });
  }
}
