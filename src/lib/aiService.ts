import { StoredValue } from "@/hooks/useLocalStorage";
import { RateLimiter, sanitizeInput, INPUT_LIMITS } from "./security";

// Rate limiter for AI API calls - max 10 calls per minute, min 2 seconds between calls
const questionRateLimiter = new RateLimiter(2000, 10);
const summaryRateLimiter = new RateLimiter(2000, 10);

export interface AIQuestionResponse {
  questions: string[];
  error?: string;
}

export async function generatePersonalizedQuestions(
  apiKey: string,
  decision: string,
  supportedValues: StoredValue[],
  jeopardizedValues: StoredValue[],
  previousResponses?: Record<string, string>
): Promise<AIQuestionResponse> {
  // Rate limiting check
  const rateLimitCheck = questionRateLimiter.canMakeCall();
  if (!rateLimitCheck.allowed) {
    return {
      questions: [],
      error: rateLimitCheck.error || "Rate limit exceeded",
    };
  }

  if (!apiKey) {
    return {
      questions: [],
      error: "OpenAI API key not configured. Please add your API key in Settings.",
    };
  }

  try {
    // Sanitize decision input
    const sanitizedDecision = sanitizeInput(decision, INPUT_LIMITS.DECISION_TEXT);

    const supportedNames = supportedValues.map(v => sanitizeInput(v.name, INPUT_LIMITS.VALUE_NAME)).join(", ");
    const jeopardizedNames = jeopardizedValues.map(v => sanitizeInput(v.name, INPUT_LIMITS.VALUE_NAME)).join(", ");

    let contextAboutPreviousRounds = "";
    if (previousResponses && Object.keys(previousResponses).length > 0) {
      contextAboutPreviousRounds = "\n\nThe user has already answered these questions:\n" +
        Object.entries(previousResponses)
          .map(([q, a]) => `Q: ${q}\nA: ${a}`)
          .join("\n\n") +
        "\n\nGenerate NEW questions that build on these insights and explore different angles.";
    }

    const systemPrompt = `You are a thoughtful reflection guide helping someone explore value trade-offs in their decisions. Your role is to ask deep, personalized questions that help them understand what matters most.`;

    const userPrompt = `The person is facing this decision: "${sanitizedDecision}"

Values being honored by this decision: ${supportedNames || "None identified"}
Values at risk with this decision: ${jeopardizedNames || "None identified"}${contextAboutPreviousRounds}

Generate exactly 3 thoughtful, personalized questions that:
1. Help them explore the specific trade-offs between these particular values
2. Question whether there might be creative ways to honor more values
3. Explore their feelings about these trade-offs over time
4. Are gentle, non-judgmental, and focused on self-awareness
5. Feel personal to their specific situation, not generic

Return only the 3 questions, one per line, without numbering or extra formatting.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.status}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Split by newlines and filter out empty lines
    const questions = content
      .split("\n")
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0)
      .slice(0, 3); // Ensure we only get 3 questions

    if (questions.length === 0) {
      throw new Error("No questions generated");
    }

    return { questions };
  } catch (error) {
    console.error("Error generating questions:", error);
    return {
      questions: [],
      error: error instanceof Error ? error.message : "Failed to generate questions",
    };
  }
}

export interface AISummaryResponse {
  summary: string;
  error?: string;
}

export async function generateRoundSummary(
  apiKey: string,
  decision: string,
  supportedValues: StoredValue[],
  jeopardizedValues: StoredValue[],
  currentRoundAnswers: Record<string, string>
): Promise<AISummaryResponse> {
  // Rate limiting check
  const rateLimitCheck = summaryRateLimiter.canMakeCall();
  if (!rateLimitCheck.allowed) {
    return {
      summary: "",
      error: rateLimitCheck.error || "Rate limit exceeded",
    };
  }

  if (!apiKey) {
    return {
      summary: "",
      error: "OpenAI API key not configured.",
    };
  }

  try {
    // Sanitize inputs
    const sanitizedDecision = sanitizeInput(decision, INPUT_LIMITS.DECISION_TEXT);
    const supportedNames = supportedValues.map(v => sanitizeInput(v.name, INPUT_LIMITS.VALUE_NAME)).join(", ");
    const jeopardizedNames = jeopardizedValues.map(v => sanitizeInput(v.name, INPUT_LIMITS.VALUE_NAME)).join(", ");

    const systemPrompt = `You are a reflective guide helping someone understand their decision-making process. Provide concise, compassionate summaries that help them see patterns in their thinking.`;

    const userPrompt = `Decision: "${sanitizedDecision}"
Values honored: ${supportedNames || "None"}
Values at risk: ${jeopardizedNames || "None"}

User's reflections:
${Object.entries(currentRoundAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Create a 100-word maximum summary that:
1. Reflects back what the user expressed in their answers
2. Relates specifically to their original dilemma
3. Acknowledges the values trade-offs they're considering
4. Is compassionate and non-judgmental
5. Helps them see patterns or insights in their thinking

Return only the summary text, no preamble or additional commentary.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.status}`
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim() || "";

    if (!summary) {
      throw new Error("No summary generated");
    }

    return { summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      summary: "",
      error: error instanceof Error ? error.message : "Failed to generate summary",
    };
  }
}
