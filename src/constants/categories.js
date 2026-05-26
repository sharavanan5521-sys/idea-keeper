/**
 * Categories Gemini can assign to an idea.
 * Keep in sync with the prompt in geminiService.js — any label added here
 * must also appear in the prompt's allowed values list.
 */
export const CATEGORIES = {
  Project:  { label: "Project",  color: "bg-blue-900 text-blue-300" },
  Creative: { label: "Creative", color: "bg-pink-900 text-pink-300" },
  Life:     { label: "Life",     color: "bg-teal-900 text-teal-300" },
  Business: { label: "Business", color: "bg-orange-900 text-orange-300" },
}

/** Ordered list used by filter UI. */
export const CATEGORY_FILTER_CHOICES = ["All", ...Object.keys(CATEGORIES)]
