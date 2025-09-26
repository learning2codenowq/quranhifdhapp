export const cleanArabicText = (text) => {
  if (!text) return text;
  
  return text
    .replace(/[●○◯]/g, '') 
    .replace(/[۩۞]/g, '') 
    .replace(/[\u06D6-\u06DC]/g, '') 
    .replace(/[\u06DF-\u06E8]/g, '') 
    .replace(/[\u06EA-\u06ED]/g, '') 
    .replace(/[\u200C-\u200F]/g, '')
    .replace(/[\u2000-\u200B]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};