// NESA-Africa Brand Colors
// These map to the design system tokens in index.css and tailwind.config.ts
// Use Tailwind classes (e.g., bg-primary, text-gold) instead of direct hex values

export const nesaColors = {
  // Primary dark backgrounds
  dark: "hsl(var(--charcoal))",
  darkAlt: "hsl(var(--charcoal-light))",
  
  // Gold accent colors
  gold: "hsl(var(--gold))",
  goldLight: "hsl(var(--gold-light))",
  goldDark: "hsl(var(--gold-dark))",
  
  // Text colors
  text: "hsl(var(--foreground))",
  textMuted: "hsl(var(--muted-foreground))",
  
  // Award tier colors (for reference)
  platinum: "#E5E4E2",
  blueGarnet: "#1E3A5F",
} as const;

// Tailwind class mappings for consistent theming
export const nesaClasses = {
  // Backgrounds
  bgDark: "bg-charcoal",
  bgDarkAlt: "bg-charcoal-light",
  bgGold: "bg-gold",
  bgGoldMuted: "bg-gold/10",
  
  // Text
  textPrimary: "text-white",
  textSecondary: "text-white/70",
  textMuted: "text-white/50",
  textGold: "text-gold",
  
  // Borders
  borderGold: "border-gold",
  borderGoldMuted: "border-gold/20",
  borderGoldLight: "border-gold/30",
  
  // Shadows
  shadowGold: "shadow-gold",
  
  // Buttons
  btnPrimary: "bg-gold hover:bg-gold-dark text-charcoal font-semibold",
  btnOutline: "border-gold text-gold hover:bg-gold/10",
  btnGhost: "text-gold hover:bg-gold/10",
} as const;

// Award tier color classes
export const tierColors = {
  platinum: {
    bg: "bg-[#E5E4E2]",
    text: "text-[#E5E4E2]",
    border: "border-[#E5E4E2]/30",
  },
  gold: {
    bg: "bg-gold",
    text: "text-gold",
    border: "border-gold/30",
  },
  "blue-garnet": {
    bg: "bg-[#1E3A5F]",
    text: "text-[#1E3A5F]",
    border: "border-[#1E3A5F]/30",
  },
  icon: {
    bg: "bg-gold",
    text: "text-gold",
    border: "border-gold/30",
  },
} as const;
