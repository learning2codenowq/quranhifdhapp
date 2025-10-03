export const TAJWEED_COLORS = {
  // Ghunnah (Nasal sound) - GREEN
  'ghunnah': '#169777',
  'idgham_w_ghunnah': '#169777',
  
  // Ikhfa/Iqlab (Hiding/Changing) - GREEN (same family as Ghunnah)
  'ikhafa_shafawi': '#169777',
  'ikhafa': '#169777',
  'idgham_shafawi': '#169777',
  'iqlab': '#169777',
  'idgham_mutajanisayn': '#169777',
  'idgham_mutaqaribayn': '#169777',
  
  // Idgham without Ghunnah - DARK GREEN
  'idgham_wo_ghunnah': '#095d42',
  
  // Qalqalah (Echoing/Bouncing) - RED
  'qalaqah': '#DD0008',
  
  // Madd (Prolongation) - PURPLE/VIOLET
  'madda_normal': '#7B1FA2',
  'madda_permissible': '#9C27B0',
  'madda_necessary': '#6A1B9A',
  'madda_obligatory': '#4A148C',
  
  // Silent/Lam Shamsiyyah - GREY
  'ham_wasl': '#AAAAAA',
  'slnt': '#AAAAAA',
  'laam_shamsiyah': '#AAAAAA',
  
  // Verse end markers
  'end': null,
};

// Parse Tajweed HTML to extract text and colors
export const parseTajweedText = (htmlText) => {
  if (!htmlText) return [{ text: '', color: null }];

  // Clean specific problematic Tajweed characters
  let cleanedText = htmlText
    // Replace Alef with Wavy Hamza (has blue circle) with regular Alef
    .replace(/ٲ/g, 'ا')  // U+0672 -> U+0627
    // Remove Quranic annotation marks
    .replace(/[\u06D6-\u06DC]/g, '')  // Small high ligatures
    .replace(/[\u06DF-\u06E4]/g, '')  // Small high signs (keep some)
    .replace(/[\u06E7-\u06E8]/g, '')  // Small high signs
    .replace(/[\u06EA-\u06ED]/g, '')  // Empty centre signs
    .replace(/[\u08F0-\u08FF]/g, '');  // Extended Arabic annotations

  const segments = [];
  
  const tajweedRegex = /<(?:tajweed|span)\s+class="?([a-z_]+)"?>([^<]*)<\/(?:tajweed|span)>/g;
  let lastIndex = 0;
  let match;

  while ((match = tajweedRegex.exec(cleanedText)) !== null) {
    // Add text before this match (normal text)
    if (match.index > lastIndex) {
      const beforeText = cleanedText.substring(lastIndex, match.index);
      if (beforeText.trim()) {
        segments.push({ text: beforeText, color: null });
      }
    }

    // Add colored segment
    const className = match[1];
    let text = match[2];
    
    // Skip the 'end' class (verse markers)
    if (className === 'end') {
      lastIndex = match.index + match[0].length;
      continue;
    }
    
    const color = TAJWEED_COLORS[className] || null;
    
    if (text.trim()) {
      segments.push({ text, color });
    }
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < cleanedText.length) {
    const remainingText = cleanedText.substring(lastIndex);
    const cleanedRemaining = remainingText.replace(/<[^>]+>/g, '').trim();
    if (cleanedRemaining) {
      segments.push({ text: cleanedRemaining, color: null });
    }
  }

  return segments.length > 0 ? segments : [{ text: htmlText, color: null }];
};

export const hasTajweedMarkup = (text) => {
  return text && (text.includes('<tajweed class=') || text.includes('<span class='));
};