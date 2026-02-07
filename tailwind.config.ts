import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        surface: "var(--bg-surface)",
        foreground: "var(--text-primary)",
        neutral: {
            800: "var(--border-subtle)",
            600: "var(--border-focus)",
            400: "var(--text-secondary)",
            200: "var(--text-accent)",
        },
        highlight: "var(--highlight)",
        error: "var(--error)",
        success: "var(--success)",
        model: {
            qwen: "var(--model-qwen)",
            llama3: "var(--model-llama3)",
            llama4: "var(--model-llama4)",
            kimi: "var(--model-kimi)",
            gpt: "var(--model-gpt)",
            minimax: "var(--model-minimax)",
            step: "var(--model-step)",
            devstral: "var(--model-devstral)",
        }
      },
      fontFamily: {
        mono: ['"Berkeley Mono"', '"SF Mono"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'xs-meta': ['12px', '1.1'],
        'sm-body': ['14px', '1.4'],
        'md-head': ['18px', '1.2'],
        'lg-disp': ['24px', '1.1'],
      }
    },
  },
  plugins: [],
};
export default config;
