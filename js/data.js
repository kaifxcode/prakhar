/*
  Catalogue data.
  SAMPLE DATA: the titles are well-known exam books, but the prices, discounts and stock are placeholders.
  Replace them with your real books.

  Book fields
    id        unique number
    title     full title
    short     short title printed on the generated cover
    author    author or publisher line
    publisher optional
    lang      'Hindi' or 'English'
    exams     list of exam ids from EXAMS below
    price     selling price
    mrp       printed price (use the same number as price for no discount)
    c1, c2    cover gradient colours
    best      true to show in Bestsellers
    isNew     true to show in New arrivals
*/

window.EXAMS = [
  { id: 'ssc',    en: 'SSC',              hi: 'कर्मचारी चयन आयोग',      names: 'CGL · CHSL · MTS · GD',        mark: 'SS' },
  { id: 'rail',   en: 'Railway',          hi: 'रेलवे भर्ती',             names: 'RRB NTPC · Group D · ALP',     mark: 'RR' },
  { id: 'bank',   en: 'Banking',          hi: 'बैंकिंग परीक्षा',          names: 'IBPS · SBI · RBI · LIC',       mark: 'BK' },
  { id: 'upsc',   en: 'UPSC & PCS',       hi: 'यूपीएससी व राज्य पीसीएस',   names: 'IAS · UPPSC · BPSC',           mark: 'IA' },
  { id: 'police', en: 'Police & Defence', hi: 'पुलिस व रक्षा',           names: 'UP Police · NDA · CDS',        mark: 'PD' },
  { id: 'teach',  en: 'Teaching',         hi: 'शिक्षक पात्रता',          names: 'CTET · UPTET · B.Ed',          mark: 'TE' },
  { id: 'entr',   en: 'NEET & JEE',       hi: 'मेडिकल व इंजीनियरिंग',     names: 'NEET · JEE Main · CUET',       mark: 'NJ' },
  { id: 'ca',     en: 'Current Affairs',  hi: 'करंट अफेयर्स',            names: 'Magazines · Year books',       mark: 'CA' }
];

window.BOOKS = [
  { id: 1,  title: "Lucent's General Knowledge",                          short: 'General Knowledge',      author: 'Lucent Publication',   lang: 'English', exams: ['ssc','rail','police','upsc','teach'], price: 285, mrp: 350, c1: '#1B2A6B', c2: '#2447D6', best: true },
  { id: 2,  title: 'लुसेंट सामान्य ज्ञान',                                short: 'सामान्य ज्ञान',            author: 'Lucent Publication',   lang: 'Hindi',   exams: ['ssc','rail','police','upsc','teach'], price: 290, mrp: 360, c1: '#7A1E2C', c2: '#C2412D', best: true },
  { id: 3,  title: 'Quantitative Aptitude for Competitive Examinations', short: 'Quantitative Aptitude',  author: 'R.S. Aggarwal',        publisher: 'S. Chand', lang: 'English', exams: ['bank','ssc','rail'], price: 520, mrp: 650, c1: '#0F5C4D', c2: '#1E9A78', best: true },
  { id: 4,  title: 'Indian Polity',                                       short: 'Indian Polity',          author: 'M. Laxmikant',         publisher: 'McGraw Hill', lang: 'English', exams: ['upsc'], price: 640, mrp: 795, c1: '#3B2370', c2: '#6D4AD1', best: true },
  { id: 5,  title: 'भारतीय राजव्यवस्था',                                  short: 'भारतीय राजव्यवस्था',      author: 'M. Laxmikant',         publisher: 'McGraw Hill', lang: 'Hindi', exams: ['upsc'], price: 625, mrp: 775, c1: '#5A2A12', c2: '#C0702B' },
  { id: 6,  title: 'A Brief History of Modern India',                     short: 'Modern India',           author: 'Rajiv Ahir',           publisher: 'Spectrum', lang: 'English', exams: ['upsc'], price: 345, mrp: 430, c1: '#1F3F5B', c2: '#3F7CAC' },
  { id: 7,  title: 'Objective General English',                           short: 'Objective English',      author: 'S.P. Bakshi',          publisher: 'Arihant', lang: 'English', exams: ['ssc','bank','rail'], price: 395, mrp: 495, c1: '#8A1C4B', c2: '#D6457F', best: true },
  { id: 8,  title: 'Word Power Made Easy',                                short: 'Word Power Made Easy',   author: 'Norman Lewis',         lang: 'English', exams: ['bank','ssc','upsc'], price: 249, mrp: 299, c1: '#24303F', c2: '#4F6279', isNew: true },
  { id: 9,  title: 'SSC CGL Chapter-wise Solved Papers',                  short: 'SSC CGL Solved Papers',  author: 'Kiran Prakashan',      lang: 'English', exams: ['ssc'], price: 410, mrp: 525, c1: '#B3480B', c2: '#F2872E', best: true, isNew: true },
  { id: 10, title: 'SSC CGL हल प्रश्न-पत्र',                              short: 'SSC CGL हल प्रश्न-पत्र',   author: 'Kiran Prakashan',      lang: 'Hindi',   exams: ['ssc'], price: 395, mrp: 510, c1: '#7B3F00', c2: '#D18A1F', isNew: true },
  { id: 11, title: 'A Modern Approach to Verbal & Non-Verbal Reasoning',  short: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', publisher: 'S. Chand', lang: 'English', exams: ['ssc','bank','rail','police'], price: 560, mrp: 695, c1: '#12506B', c2: '#2A9BC4' },
  { id: 12, title: 'Fast Track Objective Arithmetic',                     short: 'Fast Track Arithmetic',  author: 'Rajesh Verma',         publisher: 'Arihant', lang: 'English', exams: ['ssc','rail','bank'], price: 330, mrp: 420, c1: '#2F5D1B', c2: '#5FA33A' },
  { id: 13, title: '7300+ Objective Maths',                               short: '7300+ Objective Maths',  author: 'Rakesh Yadav',         lang: 'English', exams: ['ssc','rail'], price: 450, mrp: 570, c1: '#4A1B5E', c2: '#8E3EB3' },
  { id: 14, title: 'सामान्य हिंदी',                                        short: 'सामान्य हिंदी',            author: 'Lucent Publication',   lang: 'Hindi',   exams: ['ssc','police','teach'], price: 175, mrp: 215, c1: '#8C2A0B', c2: '#E0612B' },
  { id: 15, title: 'Railway Group D Exam Guide',                          short: 'Railway Group D Guide',  author: 'Exam experts',         lang: 'English', exams: ['rail'], price: 360, mrp: 450, c1: '#0B3C6E', c2: '#1B74C9', isNew: true },
  { id: 16, title: 'रेलवे ग्रुप D परीक्षा गाइड',                           short: 'रेलवे ग्रुप D गाइड',        author: 'Exam experts',         lang: 'Hindi',   exams: ['rail'], price: 340, mrp: 425, c1: '#7A1212', c2: '#CF3B3B', best: true },
  { id: 17, title: 'UP Police Constable Exam Guide',                      short: 'UP Police Constable',    author: 'Exam experts',         lang: 'Hindi',   exams: ['police'], price: 320, mrp: 400, c1: '#1E2A44', c2: '#3E5C9A' },
  { id: 18, title: 'NDA / NA Entrance Exam Guide',                        short: 'NDA / NA Guide',         author: 'Exam experts',         lang: 'English', exams: ['police'], price: 480, mrp: 600, c1: '#34412B', c2: '#71874F' },
  { id: 19, title: 'CTET Paper 1 Complete Guide',                         short: 'CTET Paper 1',           author: 'Exam experts',         lang: 'Hindi',   exams: ['teach'], price: 350, mrp: 440, c1: '#6B2D5C', c2: '#B8559E', isNew: true },
  { id: 20, title: 'Concepts of Physics',                                 short: 'Concepts of Physics',    author: 'H.C. Verma',           lang: 'English', exams: ['entr'], price: 560, mrp: 700, c1: '#0E4A52', c2: '#1B97A6', best: true },
  { id: 21, title: 'Objective NCERT at Your Fingertips: Biology',         short: 'NCERT Biology',          author: 'MTG Editorial Board',  publisher: 'MTG', lang: 'English', exams: ['entr'], price: 540, mrp: 675, c1: '#1D5B2A', c2: '#3FA85A' },
  { id: 22, title: 'Pratiyogita Darpan (monthly magazine)',               short: 'Pratiyogita Darpan',     author: 'Monthly magazine',     lang: 'Hindi',   exams: ['ca','upsc','ssc','bank','police'], price: 55, mrp: 55, c1: '#5B1A1A', c2: '#B03030', isNew: true },
  { id: 23, title: 'India Year Book',                                     short: 'India Year Book',        author: 'Publications Division', lang: 'English', exams: ['ca','upsc'], price: 320, mrp: 400, c1: '#2B2B52', c2: '#5757A8' }
];

window.SLIDES = [
  {
    kicker: 'SSC · Railway · Police',
    title: 'Crack your next government exam',
    text: 'Solved papers, maths, reasoning and general knowledge, chosen for the current pattern.',
    cta: 'Shop SSC books', exam: 'ssc',
    theme: 'blue', books: [9, 3, 7]
  },
  {
    kicker: 'UPSC & State PCS',
    title: 'The standard books for civil services',
    text: 'Polity, modern history and year books that serious aspirants keep on the desk.',
    cta: 'Shop UPSC books', exam: 'upsc',
    theme: 'plum', books: [4, 6, 23]
  },
  {
    kicker: 'हिंदी माध्यम',
    title: 'हिंदी में तैयारी, पूरी किताबों के साथ',
    text: 'सामान्य ज्ञान, राजव्यवस्था, रेलवे और पुलिस भर्ती की किताबें एक ही जगह।',
    cta: 'हिंदी किताबें देखें', lang: 'Hindi',
    theme: 'ember', books: [2, 5, 16]
  }
];
