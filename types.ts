
export interface DreamInterpretationResponse {
  interpretationText: string;
  suggestedHz: number | null;
}

export interface DreamInputFormProps {
  onSubmit: (dreamDescription: string, isLucidInterest: boolean, language: string, generateImage: boolean) => void;
  isLoading: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

// This interface helps in defining the expected JSON structure from Gemini for text
export interface GeminiRawResponse {
  interpretationText: string;
  suggestedHz: number | null;
}