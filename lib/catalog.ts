export type ProductKey = string;

export const CATALOG: { key: ProductKey; label: string; category: string }[] = [
  // entertainment
  { key: 'netflix', label: 'Netflix', category: 'entertainment' },
  { key: 'viu', label: 'Viu', category: 'entertainment' },
  { key: 'vivamax', label: 'Vivamax', category: 'entertainment' },
  { key: 'vivaone', label: 'VivaOne', category: 'entertainment' },
  { key: 'vivabundle', label: 'VivaBundle', category: 'entertainment' },
  { key: 'disney_plus', label: 'Disney+', category: 'entertainment' },
  { key: 'bilibili', label: 'Bilibili', category: 'entertainment' },
  { key: 'iqiyi', label: 'iQIYI', category: 'entertainment' },
  { key: 'wetv', label: 'WeTV', category: 'entertainment' },
  { key: 'loklok', label: 'Loklok', category: 'entertainment' },
  { key: 'iwanttfc', label: 'iWantTFC', category: 'entertainment' },
  { key: 'amazon_prime', label: 'Amazon Prime', category: 'entertainment' },
  { key: 'crunchyroll', label: 'Crunchyroll', category: 'entertainment' },
  { key: 'hbo_max', label: 'HBO Max', category: 'entertainment' },
  { key: 'youku', label: 'Youku', category: 'entertainment' },
  { key: 'nba_league_pass', label: 'NBA League Pass', category: 'entertainment' },

  // streaming
  { key: 'spotify', label: 'Spotify', category: 'streaming' },
  { key: 'youtube', label: 'YouTube', category: 'streaming' },
  { key: 'apple_music', label: 'Apple Music', category: 'streaming' },

  // educational
  { key: 'studocu', label: 'Studocu', category: 'educational' },
  { key: 'scribd', label: 'Scribd', category: 'educational' },
  { key: 'grammarly', label: 'Grammarly', category: 'educational' },
  { key: 'quillbot', label: 'QuillBot', category: 'educational' },
  { key: 'ms365', label: 'MS 365', category: 'educational' },
  { key: 'quizlet_plus', label: 'Quizlet+', category: 'educational' },
  { key: 'camscanner', label: 'CamScanner', category: 'educational' },
  { key: 'smallpdf', label: 'SmallPDF', category: 'educational' },
  { key: 'turnitin_student', label: 'Turnitin Student', category: 'educational' },
  { key: 'turnitin_instructor', label: 'Turnitin Instructor', category: 'educational' },
  { key: 'duolingo_super', label: 'Duolingo Super', category: 'educational' },

  // editing
  { key: 'canva', label: 'Canva', category: 'editing' },
  { key: 'picsart', label: 'Picsart', category: 'editing' },
  { key: 'capcut', label: 'CapCut', category: 'editing' },
  { key: 'remini_web', label: 'Remini Web', category: 'editing' },
  { key: 'alight_motion', label: 'Alight Motion', category: 'editing' },

  // ai
  { key: 'chatgpt', label: 'ChatGPT', category: 'ai' },
  { key: 'gemini_ai', label: 'Gemini AI', category: 'ai' },
  { key: 'blackbox_ai', label: 'Blackbox AI', category: 'ai' },
  { key: 'perplexity', label: 'Perplexity', category: 'ai' }
];