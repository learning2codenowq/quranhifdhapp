export class QuranService {
  static BASE_URL = 'https://quran.shayanshehzadqureshi.workers.dev/';

  static async getSurahWithTranslation(surahId) {
  try {
    console.log(`🚀 Starting API call for surah ${surahId}...`);
    
    // Add 10 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const apiUrl = `${this.BASE_URL}/api/qf/verses?chapter=${surahId}&perPage=300`;
    console.log(`📡 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    
    clearTimeout(timeoutId);
    console.log(`📈 API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📊 API returned ${data.verses?.length || 0} verses`);
    console.log(`📋 Surah info: ${data.chapter?.name_simple} (${data.chapter?.verses_count} total ayahs)`);
    
    if (!data.verses || !data.chapter) {
      throw new Error('Invalid API response structure');
    }

    const combinedAyahs = data.verses.map(verse => ({
      verse_number: verse.number,
      text: verse.text,
      translation: verse.translationHtml || '',
      translationHtml: verse.translationHtml || '',
      audioUrl: verse.audioUrl
    }));

    console.log(`✅ Final result: ${combinedAyahs.length} ayahs processed`);

    return {
      surah: {
        id: data.chapter.id,
        name: data.chapter.name_simple,
        arabic_name: data.chapter.name_arabic,
        total_ayahs: data.chapter.verses_count || data.chapter.total_ayahs || data.verses.length,
        bismillah_pre: data.chapter.bismillah_pre
      },
      ayahs: combinedAyahs,
      bismillah: data.bismillah
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API request timed out');
      throw new Error('Request timed out. Please check your connection.');
    }
    console.error('Error fetching surah from worker API:', error);
    throw error;
  }
}

  static async getAllSurahs() {
  try {
    const response = await fetch(`${this.BASE_URL}/api/qf/chapters`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapters from server');
    }
    
    const data = await response.json();
    
    if (!data.chapters) {
      throw new Error('Failed to fetch chapters list');
    }

    return data.chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name_simple,
      arabic_name: chapter.name_arabic,
      total_ayahs: chapter.verses_count || chapter.total_ayahs || 0,
      type: chapter.revelation_place || 'Unknown'
    }));
  } catch (error) {
    // Handle network connectivity issues
    if (error.message === 'Network request failed' || error.name === 'TypeError') {
      throw new Error('No internet connection. Please check your network and try again.');
    } else if (error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    console.error('Error fetching chapters:', error);
    throw error;
  }
}
  // NEW: Get page for reading
  static async getPageData(pageNumber) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/qf/page?pageNumber=${pageNumber}&textFormat=uthmani`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.verses || !data.page) {
        throw new Error('Invalid API response structure');
      }

      return {
        page: {
          number: data.page.number,
          total_pages: data.page.total_pages,
          juz_number: data.page.juz_number,
          hizb_number: data.page.hizb_number
        },
        verses: data.verses.map(verse => ({
          key: verse.key,
          number: verse.number,
          text: verse.text,
          translation: verse.translationHtml || '',
          juz_number: verse.juz_number,
          page_number: verse.page_number,
          hizb_number: verse.hizb_number
        }))
      };
    } catch (error) {
      console.error('Error fetching page from worker API:', error);
      throw error;
    }
  }
}