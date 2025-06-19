
import { GoogleGenAI, GenerateContentResponse, GenerateImagesResponse } from "@google/genai";
import type { DreamInterpretationResponse } from '../types';

const API_KEY = process.env.API_KEY;

const getAiClient = () => {
  if (!API_KEY) {
    console.error("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
    throw new Error("API key not configured. This application requires an API key to function.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const interpretDream = async (dreamDescription: string, isLucidDreamInterest: boolean, language: string): Promise<DreamInterpretationResponse> => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash-preview-04-17';

  const prompt = `You are an advanced dream interpreter, highly skilled in both Western psychological approaches and ancient Vedic wisdom.
Your goal is to provide a comprehensive, empathetic, and insightful analysis of the user's dream IN THE SPECIFIED LANGUAGE: ${language}.
The entire response, including all explanations and headings, must be in ${language}.
Use SIMPLE, CLEAR, and EASY-TO-UNDERSTAND ${language}, as if explaining complex topics to a layperson. Avoid jargon where possible, or explain it clearly if essential.

Respond STRICTLY with a JSON object containing two keys: "interpretationText" and "suggestedHz".

The user's dream description is: "${dreamDescription}"
The user's explicit interest in lucid dreaming (via checkbox) is: ${isLucidDreamInterest ? "Yes" : "No"}.
(Also infer lucid dream interest if the dream description itself contains phrases like "i want lucid", "how to become lucid", "help me lucid dream", or similar direct expressions of desire for lucidity in any language provided).

"interpretationText": This string should be well-structured with clear headings and paragraphs, all in ${language}.
Use markdown-style H2 headings (e.g., "## Heading Title") for main sections and H3 (e.g., "### Sub-heading") for sub-sections.

The "interpretationText" should contain the following parts in order, all in simple ${language}:

I. CORE DREAM INTERPRETATION:
   ## Western Scientific Perspective
     - Analyze key themes, symbols, and emotions from a psychological standpoint (e.g., cognitive processing, emotional regulation, problem-solving, archetypes, defense mechanisms).
     - Discuss potential connections to recent life events, stressors, or unresolved conflicts.
   ## Vedic Perspective
     - Analyze the dream based on Vedic principles. Consider the potential influence of Gunas (Sattva, Rajas, Tamas) and Doshas (Vata, Pitta, Kapha) if the dream provides clues.
     - Interpret symbols based on Vedic/Hindu iconography, mythology, and scriptural references where appropriate.
     - Discuss potential karmic insights, spiritual messages, or lessons the dream might be offering, always with sensitivity.

II. LUCID DREAMING GUIDANCE (Include this entire section ONLY if lucid dream interest is indicated by checkbox OR inferred from the dream description):
   ## Lucid Dreaming: Bridging Worlds
     - Start with a brief acknowledgment of their interest in lucidity.
   ### Techniques (Western Approach)
     - Provide specific, actionable techniques (e.g., Reality Checks, MILD, WBTB, SSILD, Dream Journaling) tailored to THIS PARTICULAR DREAM's content. Explain how to apply them.
   ### Techniques (Vedic Perspective)
     - Provide specific, actionable techniques from Vedic traditions for cultivating dream awareness and lucidity, tailored to THIS DREAM. Examples: Yoga Nidra, Dhyana (Meditation), Mantra Japa, understanding Swapna, Jagrat, Sushupti.

III. BINAURAL BEATS SUGGESTION:
   ## Binaural Beats for Your Journey
     - Conclude with a brief, gentle suggestion for specific binaural beat frequencies.
     - Explain CLEARLY AND BRIEFLY why these frequencies could be relevant in the context of THIS SPECIFIC DREAM's themes, emotions, or symbols. This explanation is crucial.
     - Frame this as an optional exploration, not medical advice.

"suggestedHz": This number should be the single, primary binaural beat frequency (e.g., 4, 6, 10).
IT IS CRUCIAL that this frequency is NOT a generic suggestion. It MUST be specifically chosen and justified by the unique content, themes, emotions, or symbols described in the user's dream: "${dreamDescription}".
For example, if the dream is about deep peace and underwater exploration, a Theta frequency (e.g., 4-7 Hz) might be suitable. If it's about anxiety and unresolved tasks, a higher Alpha (e.g., 10-12 Hz) or even Theta for deep relaxation could be considered. If it's about creative breakthroughs, specific Theta or Alpha frequencies could be explored.
The reasoning for the chosen frequency MUST be included in the '## Binaural Beats for Your Journey' section of 'interpretationText'.
If, after careful consideration of THE SPECIFIC DREAM, no particular frequency strongly aligns or seems appropriate, provide null. Do not force a suggestion.

Ensure the "interpretationText" flows well, is empathetic, and the advice is seamlessly integrated.
The language should be clear, supportive, and respectful of all perspectives.

Example of a valid JSON response structure (user dream: "I was flying over mountains, felt free. I want lucid.", language: "English"):
{
  "interpretationText": "Your dream of flying over mountains signifies a sense of freedom, perspective, and perhaps a desire to transcend limitations. Your explicit wish 'I want lucid' indicates a strong calling to explore this expansive state with full awareness.\\n\\n## Western Scientific Perspective\\nFrom a psychological viewpoint, flying dreams often symbolize a desire for liberation, ambition, or a new perspective on life's challenges...\\n\\n## Vedic Perspective\\nIn Vedic thought, flying can be associated with the Vata dosha...\\n\\n## Lucid Dreaming: Bridging Worlds\\nYour aspiration for lucidity is a wonderful step!\\n### Techniques (Western Approach)\\n1. Reality Checks with Altitude...\\n2. MILD for Flying...\\n### Techniques (Vedic Perspective)\\n1. Yoga Nidra for Witnessing...\\n2. Akasha Dhyana (Space Meditation)...\\n\\n## Binaural Beats for Your Journey\\nGiven the expansive and insightful nature of your flying dream, and your interest in lucidity, exploring Theta waves around 6 Hz could be beneficial. Theta waves are often associated with deep meditation, creativity, and states conducive to lucid dreaming, aligning with the feeling of freedom you experienced.\\nThis could support further exploration of such expansive dream states.",
  "suggestedHz": 6
}
Example of a valid JSON response structure (user dream: "I felt chased by a shadowy figure in a dark forest, I was very scared.", language: "English"):
{
  "interpretationText": "Your dream of being chased by a shadowy figure in a dark forest indicates feelings of fear, anxiety, or confronting unknown aspects of yourself or a situation...\\n\\n## Western Scientific Perspective\\nPsychologically, being chased often represents avoidance of a problem...\\n\\n## Vedic Perspective\\nFrom a Vedic standpoint, the dark forest and shadow could symbolize Tamas Guna...\\n\\n## Binaural Beats for Your Journey\\nTo help process the fear and anxiety from this dream and promote a sense of calm, you might consider Alpha waves, perhaps around 10 Hz. Alpha waves are associated with relaxation and stress reduction, which could be helpful in counteracting the dream's unsettling feelings and fostering a more peaceful state for reflection.",
  "suggestedHz": 10
}
Example of a valid JSON response structure (user dream: "I was just doing my taxes, it was boring.", language: "English"):
{
  "interpretationText": "Your dream about doing taxes, while seemingly mundane, might reflect feelings about routine, responsibility, or perhaps a sense of being overwhelmed by daily tasks...\\n\\n## Western Scientific Perspective\\n...\\n\\n## Vedic Perspective\\n...\\n\\n## Binaural Beats for Your Journey\\nFor a dream focused on mundane tasks like taxes, there isn't a strongly indicated binaural beat frequency for direct dream processing. However, if the dream left you feeling a bit drained or unfocused, a general Alpha frequency (e.g., 10 Hz) for relaxation or a low Beta frequency (e.g., 12-15 Hz) for gentle focus could be explored if you wish to shift your mental state post-dream. No specific frequency is directly suggested by the dream's content itself.",
  "suggestedHz": null
}

The user's dream is: "${dreamDescription}"
The language for the response is: ${language}
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as { interpretationText: string; suggestedHz: number | null; };
      
      if (typeof parsedData.interpretationText !== 'string' || (typeof parsedData.suggestedHz !== 'number' && parsedData.suggestedHz !== null) ) {
        console.error("Parsed JSON does not match expected structure (interpretationText: string, suggestedHz: number|null):", parsedData);
        throw new Error("AI response structure is invalid. Please try again.");
      }
      if (parsedData.suggestedHz !== null && (isNaN(parsedData.suggestedHz) || parsedData.suggestedHz <= 0 || parsedData.suggestedHz > 40)) {
          console.warn(`Received potentially invalid suggestedHz: ${parsedData.suggestedHz}. Setting to null.`);
          parsedData.suggestedHz = null;
      }
      return {
        interpretationText: parsedData.interpretationText,
        suggestedHz: parsedData.suggestedHz
      };
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", e, "Raw response:", jsonStr);
      throw new Error("Failed to parse dream interpretation from AI. The response was not valid JSON.");
    }

  } catch (error) {
    console.error("Error interpreting dream:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes("api key not valid")) {
             throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit")) {
            throw new Error("API request limit reached. Please try again later.");
        }
    }
    throw new Error("Failed to get dream interpretation. The AI service might be temporarily unavailable.");
  }
};

export const generateDreamImage = async (dreamDescription: string): Promise<string | null> => {
  const ai = getAiClient();
  const imageModel = 'imagen-3.0-generate-002';
  
  // Emphasize landscape orientation with descriptive terms and strong directives.
  const imagePrompt = `**ULTRA-CRITICAL REQUIREMENT: LANDSCAPE ORIENTATION (16:9 ASPECT RATIO OR WIDER).**
The image MUST be HORIZONTAL, significantly wider than it is tall.
**ABSOLUTELY NO PORTRAIT IMAGES. ABSOLUTELY NO SQUARE IMAGES.**
This is the single most important rule for the image creation.

Dream Content for Visualization: "${dreamDescription}"

Based on the dream, generate a **cinematic, panoramic, wide-angle shot** of an ethereal and surreal dreamscape.
The image should capture the feeling of an **expansive vista** or a **sweeping horizon line**.
Focus on symbolic elements, overall mood, and emotional tone, rather than a strictly literal depiction of the dream.
The style should be artistic, imaginative, and dream-like.

**STRICTLY NO TEXT:** The image must be purely visual. Do NOT include any text, letters, words, numbers, or watermarks.`;

  try {
    const response: GenerateImagesResponse = await ai.models.generateImages({
      model: imageModel,
      prompt: imagePrompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.warn("Image generation did not return expected image data.");
      return null;
    }
  } catch (error) {
    console.error("Error generating dream image:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes("api key not valid")) {
             throw new Error("The provided API key is invalid for image generation or general use. Please check your configuration.");
        }
        if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit")) {
            throw new Error("Image generation API request limit reached. Please try again later.");
        }
         if (error.message.toLowerCase().includes("filtered")) {
            throw new Error("Image generation request was filtered due to safety policies. Please try a different dream description.");
        }
    }
    throw new Error("Failed to generate dream image. The AI service might be temporarily unavailable or the prompt was unsuitable.");
  }
};