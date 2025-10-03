// Tajweed color mapping based on Quran.com standard
export const TAJWEED_COLORS = {
  'ham_wasl': '#AAAAAA',        // Hamzat ul Wasl - Grey
  'slnt': '#AAAAAA',            // Silent - Grey  
  'laam_shamsiyah': '#AAAAAA',  // Lam Shamsiyyah - Grey
  'madda_normal': '#4050FF',    // Normal Madd - Blue
  'madda_permissible': '#4050FF', // Permissible Madd - Blue
  'madda_necessary': '#4050FF',  // Necessary Madd - Blue
  'qalaqah': '#DD0008',         // Qalqalah - Red
  'madda_obligatory': '#2144C1', // Obligatory Madd - Dark Blue
  'ikhafa_shafawi': '#169777',  // Ikhafa Shafawi - Green
  'ikhafa': '#169777',          // Ikhafa - Green
  'idgham_shafawi': '#169777',  // Idgham Shafawi - Green
  'iqlab': '#169777',           // Iqlab - Green
  'idgham_w_ghunnah': '#169777', // Idgham with Ghunnah - Green
  'idgham_wo_ghunnah': '#169777', // Idgham without Ghunnah - Green
  'idgham_mutajanisayn': '#169777', // Idgham Mutajanisayn - Green
  'idgham_mutaqaribayn': '#169777', // Idgham Mutaqaribayn - Green
  'ghunnah': '#AAAAAA',         // Ghunnah - Grey
};

// Parse Tajweed HTML to extract text and colors
export const parseTajweedText = (htmlText) => {
  if (!htmlText) return [{ text: '', color: null }];

  const segments = [];
  
  // FIXED: Look for <tajweed> tags instead of <span> tags
  const tajweedRegex = /<tajweed class=([a-z_]+)>([^<]+)<\/tajweed>/g;
  let lastIndex = 0;
  let match;

  while ((match = tajweedRegex.exec(htmlText)) !== null) {
    // Add text before this match (normal text)
    if (match.index > lastIndex) {
      const beforeText = htmlText.substring(lastIndex, match.index);
      if (beforeText) {
        segments.push({ text: beforeText, color: null });
      }
    }

    // Add colored segment
    const className = match[1];
    const text = match[2];
    const color = TAJWEED_COLORS[className] || null;
    
    segments.push({ text, color });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < htmlText.length) {
    const remainingText = htmlText.substring(lastIndex);
    if (remainingText) {
      segments.push({ text: remainingText, color: null });
    }
  }

  return segments.length > 0 ? segments : [{ text: htmlText, color: null }];
};

// Check if text contains Tajweed markup
export const hasTajweedMarkup = (text) => {
  return text && text.includes('<tajweed class=');
};