import Groq from "groq-sdk";
import { config } from "../config.js";

const client = new Groq({ apiKey: config.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are an expert career coach and professional writer with 15+ years
of experience helping candidates land jobs at top companies.

Your job is to generate two things:
1. A tailored, compelling cover letter
2. A cold outreach email to the hiring manager

You will be given:
- Job Title
- Company Name  
- Job Description
- Candidate Background
- Preferred Tone
- Hiring Manager Name (optional)

RULES:
- Cover letter must be 3 paragraphs, max 350 words
- Paragraph 1: Strong opening hook — do NOT start with
  "I am writing to apply"
- Paragraph 2: Connect candidate's specific experience
  to the job requirements. Be concrete, not generic
- Paragraph 3: Confident closing with a clear call to action
- Cold email must be max 150 words, conversational,
  ends with a soft CTA
- Cold email must include a subject line
- If hiring manager name is not provided, open with "Hi there,"
- Do NOT use filler phrases like "I am passionate about",
  "I am a team player", "I think outside the box"
- Output ONLY valid JSON. No explanation, no markdown
  backticks, no preamble. Just the raw JSON object.

Output format:
{
  "coverLetter": "full cover letter text here",
  "coldEmail": {
    "subject": "email subject line here",
    "body": "email body here"
  }
}
`;

export const generateCoverLetter = ({
  jobTitle,
  companyName,
  jobDescription,
  userBackground,
  tone,
  hiringManagerName,
}) => {
  const userMessage = `
Job Title: ${jobTitle}
Company Name: ${companyName}
Job Description: ${jobDescription}
Candidate Background: ${userBackground}
Preferred Tone: ${tone}
Hiring Manager Name: ${hiringManagerName || "Not provided"}
  `.trim();

  return client.chat.completions
    .create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }, // forces valid JSON output
    })
    .then((response) => {
      const text = response.choices[0].message.content;
      return JSON.parse(text);
    })
    .catch((err) => {
      return Promise.reject({
        status: 502,
        message: `AI generation failed: ${err.message}`,
      });
    });
};