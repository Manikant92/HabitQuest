
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				habit: {
					purple: '#8B5CF6',
					darkpurple: '#7E69AB',
					green: '#50C878',
					yellow: '#FEF7CD',
					orange: '#FEC6A1',
					softpurple: '#E5DEFF',
					pixelgreen: '#7FFFD4',
					pixeldarkgreen: '#2E8B57',
					pixelblue: '#87CEEB',
					pixelpurple: '#9370DB',
					neon: '#39FF14',
					cyber: '#00FFFF',
				}
			},
			backgroundImage: {
				'game-pattern': "url('/habitquest-uploads/7b49117b-2964-437c-bc83-126a197052e9.png')",
				'gradient-game': 'linear-gradient(to bottom, rgba(16, 24, 39, 0.9), rgba(16, 24, 39, 0.7))',
				'cyber-grid': 'linear-gradient(to right, rgba(127, 255, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(127, 255, 212, 0.1) 1px, transparent 1px)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'point-earned': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'50%': { transform: 'scale(1.2)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pixel-float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'neon-pulse': {
					'0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(127, 255, 212, 0.7))' },
					'50%': { filter: 'drop-shadow(0 0 10px rgba(127, 255, 212, 1))' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'point-earned': 'point-earned 0.5s ease-out',
				'pixel-float': 'pixel-float 3s ease-in-out infinite',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
