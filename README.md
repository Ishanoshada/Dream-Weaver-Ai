# Dream Weaver AI

Unravel the mysteries of your subconscious with Dream Weaver AI! This application uses the power of Google's Gemini API to provide insightful interpretations of your dreams from both Western scientific and Vedic perspectives. It also offers tailored lucid dreaming techniques, can generate binaural beats to complement your dream exploration, and even visualize your dream with an AI-generated image.


![img](/imgs/1.png)

## Features

*   **AI-Powered Dream Interpretation**: Get detailed analysis of your dreams.
*   **Dual Perspectives**: Insights from both Western psychological approaches and ancient Vedic wisdom.
*   **Lucid Dreaming Guidance**:
    *   Indicate interest in lucid dreaming.
    *   Receive actionable techniques tailored to your dream content from both Western and Vedic traditions.
*   **AI Dream Image Generation**:
    *   Optionally generate a unique, artistic image representing your dream.
    *   Download the generated image.
*   **Multi-Language Support**: Get interpretations in various languages including English, Sinhala, Tamil, Arabic, Hindi, and more.
*   **Binaural Beats Generation**:
    *   Suggests specific binaural beat frequencies (Hz) based on your dream.
    *   Built-in player to generate and listen to a 15-minute session of the suggested beats (use headphones for best results).
    *   "Learn More" section explaining the science behind binaural beats and brainwave states.
*   **Immersive Universe Theme**:
    *   **Animated Starry Background**: A dynamic, twinkling starfield sets a cosmic mood.
    *   **Cosmic Gradients**: UI elements feature slowly panning, deep space-inspired gradients.
    *   **Floating Elements**: Subtle animations like a floating header icon add life to the interface.
    *   **Pulsing Effects**: Key buttons have a gentle pulsing glow, enhancing interactivity.
    *   **Content Entry Animations**: Interpretation results and other content blocks "emerge" smoothly onto the screen.
    *   **Modern UI**: Clean, responsive design that adapts to all screen sizes.
    *   **Light and Dark Mode Support**: The application respects system preferences for light/dark mode.
*   **Interactive Input Form**: Easily describe your dream, specify lucid dream interest, request an image, and choose your preferred language.

![img](/imgs/2.png)

## Technology Stack

*   **Frontend**: React (via esm.sh, no build step needed for basic React), Tailwind CSS (via CDN)
*   **AI**: Google Gemini API (`@google/genai`) for text interpretation (`gemini-2.5-flash-preview-04-17`) and image generation (`imagen-3.0-generate-002`).
*   **Audio**: Web Audio API (for binaural beats)
*   **Styling**: Tailwind CSS, custom CSS for the universe theme animations and overall theming.

## Prerequisites

*   A modern web browser.
*   A Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   Node.js and npm (or npx) installed (optional, for `http-server` or similar local servers).

![img](/imgs/3.png)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ishanoshada/Dream-Weaver-Ai.git # Replace with your actual repo URL if different
cd Dream-Weaver-Ai
```

### 2. Set up the API Key

The application requires a Google Gemini API key to function. The code in `services/geminiService.ts` expects this key to be available as `process.env.API_KEY`.

When running a simple static `index.html` file directly, `process.env` variables are not typically available as they are in a Node.js backend or during a build process (like with Vite or Create React App). Here are a couple of ways to handle this for **local development**:

*   **Recommended for more robust local dev (if you have a Node.js server setup):**
    If you're using a local Node.js server (e.g., Express) to serve your files, you can use a package like `dotenv` to load variables from a `.env` file into `process.env`. Create a `.env` file in the root of your project:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
    Ensure your server loads this (e.g., `require('dotenv').config();`). This approach is not directly supported by just opening `index.html`.

*   **Quick and Dirty for Basic Local Testing (directly opening `index.html` or using a very simple static server):**
    For the simplest local testing where you're just serving static files and don't have a mechanism to inject environment variables:
    1.  Open the file `services/geminiService.ts`.
    2.  **Temporarily** replace the line `const API_KEY = process.env.API_KEY;` with your actual API key:
        ```javascript
        // const API_KEY = process.env.API_KEY;
        const API_KEY = "YOUR_ACTUAL_GEMINI_API_KEY_HERE"; // For local testing ONLY
        ```
    3.  **IMPORTANT**: Remember to **NEVER commit your API key** directly into the code. Revert this change before committing or deploying. This method is only for quick local testing.

### 3. Run the Application Locally

Since this is a static frontend application (React is loaded via CDN using an import map), you can run it by opening the `index.html` file in your browser. However, for API requests and proper module loading, it's better to serve it using a local HTTP server or a dev server.

*   **Using npm scripts (if provided in `package.json`):**
    1.  Install dependencies:
        ```bash
        npm install
        ```
    2.  Start the development server:
        ```bash
        npm run dev
        ```
        Or build for production:
        ```bash
        npm run build
        ```
    3.  Follow the output instructions to open the app in your browser.

*   **Using `http-server` (requires Node.js/npx):**
    1.  If you don't have `http-server` installed globally, you can run it with `npx`:
        ```bash
        npx http-server .
        ```
    2.  Open your browser and navigate to the URL provided by `http-server` (usually `http://localhost:8080`).

*   **Using Python's built-in server (if you have Python installed):**
    For Python 3:
    ```bash
    python -m http.server
    ```
    Then navigate to `http://localhost:8000`.

## How It Works

1.  **User Input**: The user describes their dream, indicates interest in lucid dreaming, opts for image generation, and selects their preferred language through the `DreamInputForm`.
2.  **API Service**: The `geminiService.ts` takes this input:
    *   For text interpretation, it sends a carefully crafted prompt to the Google Gemini API (`gemini-2.5-flash-preview-04-17` model). The prompt instructs the AI to provide an interpretation structured in JSON, considering Western and Vedic perspectives, and to include lucid dreaming techniques if requested, all in the selected language and simple terms.
    *   For image generation (if requested), it sends a prompt to the `imagen-3.0-generate-002` model, aiming for a surreal, landscape-oriented visual.
3.  **Response Handling**: The application receives the JSON response for text (including `interpretationText` and a `suggestedHz` for binaural beats) and the image data.
4.  **Display**:
    *   `InterpretationDisplay.tsx` parses the markdown-style headings in `interpretationText` and renders the interpretation.
    *   `ImageDisplay.tsx` shows the generated dream image with a download option.
    *   `BinauralBeatPlayer.tsx` uses the `suggestedHz` and the Web Audio API to generate and play the binaural beats if a frequency is suggested.
5.  **Theming & Animations**: The "Universe Theme" is applied using custom CSS in `index.html` and Tailwind CSS utility classes, providing an immersive visual experience. Light and Dark modes are supported.

## Project Structure

*   `index.html`: Main HTML file, includes Tailwind CSS CDN, custom CSS for animations, and initial theme script.
*   `index.tsx`: Entry point for the React application.
*   `App.tsx`: Main application component, manages state and overall layout.
*   `components/`: Contains all React components (Header, Footer, Forms, Display elements, etc.).
*   `services/geminiService.ts`: Handles communication with the Google Gemini API for both text and image generation.
*   `types.ts`: TypeScript type definitions.
*   `metadata.json`: Application metadata.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

---

Crafted by [Ishanoshada](https://github.com/Ishanoshada/).