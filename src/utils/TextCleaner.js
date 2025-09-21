export const cleanArabicText = (text) => {
  if (!text) return text;
  
  return text
    // Remove only specific problematic symbols, NOT all diacriticals
    .replace(/[●○◯]/g, '') // Black and white circles (the main culprits)
    .replace(/[۩۞]/g, '') // Sajdah markers
    // Remove specific problematic Unicode ranges but keep essential harakat
    .replace(/[\u06D6-\u06DC]/g, '') // Only some Arabic small high marks
    .replace(/[\u06DF-\u06E8]/g, '') // Some other markers
    .replace(/[\u06EA-\u06ED]/g, '') // More markers
    // Keep essential diacriticals: َ ِ ُ ّ ْ ً ٌ ٍ ّٰ etc.
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
};