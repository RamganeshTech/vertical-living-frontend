// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    darkMode: 'class', // Important for future light/dark switching
    theme: {
        extend: {
            colors: {
                // New Professional Semantic Palette
                brand: {
                    main: 'var(--color-brand-main)',
                    surface: 'var(--color-brand-surface)',
                    'surface-hover': 'var(--color-brand-surface-hover)', // 🆕
                    ash: 'var(--color-brand-ash)',
                    'ash-dark': 'var(--color-brand-ash-dark)', // 🆕
                },
                ash: {
                    lighter: 'var(--color-ash-lighter)', // 🆕
                    light: 'var(--color-ash-light)',
                    medium: 'var(--color-ash-medium)',
                    dark: 'var(--color-ash-dark)',
                },
                text: {
                    strong: 'var(--color-text-strong)', // 🆕 For h1, h2, h3
                    main: 'var(--color-text-main)',
                    muted: 'var(--color-text-muted)',
                    soft: 'var(--color-text-soft)', // 🆕 For placeholders/icons
                },
                action: {
                    primary: 'var(--color-action-primary)',
                    'primary-hover': 'var(--color-action-primary-hover)', // 🆕
                    secondary: 'var(--color-action-secondary)', // 🆕 For outline/ghost buttons
                    'secondary-hover': 'var(--color-action-secondary-hover)', // 🆕
                    success: 'var(--color-action-success)',
                    danger: 'var(--color-action-danger)',
                    warning: 'var(--color-action-warning)', // 🆕 Good for "Pending" statuses
                },

             // Legacy colors (keep these so existing code doesn't break)
                selectedBg: '#494950',
                blackBG: '#35353d',
                "black-bg": "#444444",
                whiteBg: '#f5f7fa',
                blueBg: '#4a86f7',
                headingBg: '#e9edf1',
                lableColor: '#36445a',
                primary: '#1D4ED8',
                secondary: '#9333EA',
                dark: '#1E293B',
            },
            fontFamily: {
                poppins: ['Poppins', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
                roboto: ['Roboto', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
                arial: ['Arial', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
            },
            spacing: {
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            },
            borderRadius: {
                'xl': '1.5rem',
                '2xl': '2rem',
            },
            keyframes: {
                bounceOnce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeInOnce: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOutOnce: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
            animation: {
                bounceOnce: 'bounceOnce 0.6s ease-out forwards',
                fadeInOnce: 'fadeInOnce 0.5s ease-out forwards',
                fadeOutOnce: 'fadeOutOnce 0.5s ease-in forwards',
            },
        },
    },
    plugins: [],
}

export default config
