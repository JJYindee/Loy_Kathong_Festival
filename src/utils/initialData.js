// 20 Initial Krathongs with Thai contestants, realistic wishes, styles, and initial votes

export const KRATHONG_STYLES = [
  { id: 'banana_leaf', name: 'ใบตองมรกตวิจิตร', color: '#2e7d32', petalColor: '#66bb6a', candleColor: '#ffeb3b' },
  { id: 'pink_lotus', name: 'บัวชมพูสวรรค์', color: '#c2185b', petalColor: '#f06292', candleColor: '#ff80ab' },
  { id: 'golden_glory', name: 'สุพรรณิการ์ทองคำ', color: '#f57f17', petalColor: '#fbc02d', candleColor: '#fff59d' },
  { id: 'royal_purple', name: 'อัญชันทิพยมงคล', color: '#4a148c', petalColor: '#ab47bc', candleColor: '#e1bee7' },
  { id: 'siam_ruby', name: 'ทับทิมสยามเรืองรอง', color: '#b71c1c', petalColor: '#e53935', candleColor: '#ffcdd2' }
];

// Helper to generate colorful artistic avatar SVGs
function createAvatarSvg(bgGradient, emoji, text) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
    </defs>
    <circle cx="80" cy="80" r="76" fill="url(%23grad)" stroke="%23ffffff" stroke-width="4"/>
    <text x="50%" y="48%" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    <text x="50%" y="82%" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23ffffff" text-anchor="middle">${text}</text>
  </svg>`;
}

export const INITIAL_CONTESTANTS = [
  {
    id: 'k1',
    name: 'น้องปรางค์ นภัสสร',
    wish: 'ขอขมาพระแม่คงคา ขอให้ครอบครัวมีสุขภาพแข็งแรง ร่ำรวยความสุขตลอดปี',
    style: 'pink_lotus',
    votes: 142,
    photo: createAvatarSvg(['#ec4899', '#be185d'], '🌸', 'ปรางค์')
  },
  {
    id: 'k2',
    name: 'พี่ก้อง เกียรติศักดิ์',
    wish: 'ขอให้การงานราบรื่น ธุรกิจเติบโต ประสบความสำเร็จทุกเป้าหมาย',
    style: 'golden_glory',
    votes: 98,
    photo: createAvatarSvg(['#eab308', '#ca8a04'], '⭐', 'ก้อง')
  },
  {
    id: 'k3',
    name: 'น้องมุก ณิชานันท์',
    wish: 'ขอให้สอบติดคณะที่หวังไว้ ได้คะแนนดีๆ สมความตั้งใจค่ะ',
    style: 'banana_leaf',
    votes: 125,
    photo: createAvatarSvg(['#10b981', '#047857'], '🍀', 'มุก')
  },
  {
    id: 'k4',
    name: 'คุณยายสมพร & ตาบุญ',
    wish: 'ขอให้ลูกหลานทุกคนเจริญก้าวหน้า มีแต่สิ่งดีๆ เข้ามาในชีวิต',
    style: 'banana_leaf',
    votes: 180,
    photo: createAvatarSvg(['#6366f1', '#4338ca'], '👵', 'สมพร')
  },
  {
    id: 'k5',
    name: 'อาร์ต ธีรดนย์',
    wish: 'ขอให้เจอความรักที่จริงใจ สดใสเหมือนแสงเทียนในคืนเพ็ญ',
    style: 'siam_ruby',
    votes: 87,
    photo: createAvatarSvg(['#ef4444', '#b91c1c'], '💖', 'อาร์ต')
  },
  {
    id: 'k6',
    name: 'ฟ้า วรัทยา',
    wish: 'ลอยเคราะห์ลอยโศก ขอให้พบเจอแต่มิตรแท้และรอยยิ้มในทุกๆ วัน',
    style: 'royal_purple',
    votes: 110,
    photo: createAvatarSvg(['#8b5cf6', '#6d28d9'], '🌙', 'ฟ้า')
  },
  {
    id: 'k7',
    name: 'เจษฎา มหาวงศ์',
    wish: 'ขอให้ประเทศสงบสุข เศรษฐกิจดี ประชาชนทุกคนยิ้มแย้มแจ่มใส',
    style: 'golden_glory',
    votes: 95,
    photo: createAvatarSvg(['#f97316', '#c2410c'], '🕊️', 'เจษฎา')
  },
  {
    id: 'k8',
    name: 'หมิว กัญญารัตน์',
    wish: 'ขอให้ได้ไปเที่ยวรอบโลก มีชีวิตอิสระและมีความสุขในแบบของตัวเอง',
    style: 'pink_lotus',
    votes: 134,
    photo: createAvatarSvg(['#f43f5e', '#be123c'], '✈️', 'หมิว')
  },
  {
    id: 'k9',
    name: 'บอส ศุภณัฐ',
    wish: 'ขอให้โปรเจกต์โค้ดไร้บั๊ก ระบบเสถียร 99.99% Deploy ผ่านฉลุย!',
    style: 'banana_leaf',
    votes: 156,
    photo: createAvatarSvg(['#06b6d4', '#0e7490'], '💻', 'บอส')
  },
  {
    id: 'k10',
    name: 'ปันปัน เด็กหญิงแก้มใส',
    wish: 'ขอให้ได้กินไอติมทุกวัน มีของเล่นเยอะๆ และคุณแม่ใจดีค่ะ',
    style: 'pink_lotus',
    votes: 167,
    photo: createAvatarSvg(['#fb7185', '#e11d48'], '🍭', 'ปันปัน')
  },
  {
    id: 'k11',
    name: 'ครูสมศรี โรงเรียนวัดใหญ่',
    wish: 'ขอให้ลูกศิษย์ทุกคนเป็นคนดี มีวิชาความรู้ นำพาสังคมเจริญ',
    style: 'royal_purple',
    votes: 89,
    photo: createAvatarSvg(['#a855f7', '#7e22ce'], '📚', 'ครูสมศรี')
  },
  {
    id: 'k12',
    name: 'ต้น รชต',
    wish: 'ขอให้ร่างกายแข็งแรง หายจากอาการปวดหลัง วิ่งมาราธอนจบปีนี้',
    style: 'banana_leaf',
    votes: 76,
    photo: createAvatarSvg(['#22c55e', '#15803d'], '🏃', 'ต้น')
  },
  {
    id: 'k13',
    name: 'วิว พรรณิดา',
    wish: 'ขอให้ธุรกิจร้านกาแฟมีลูกค้าแน่นทุกวัน ได้ทำในสิ่งที่รักเสมอ',
    style: 'golden_glory',
    votes: 104,
    photo: createAvatarSvg(['#eab308', '#a16207'], '☕', 'วิว')
  },
  {
    id: 'k14',
    name: 'นัทธพงศ์ วงศ์สวรรค์',
    wish: 'ขอให้แม่น้ำลำคลองสะอาดใส ธรรมชาติกลับมาอุดมสมบูรณ์',
    style: 'siam_ruby',
    votes: 112,
    photo: createAvatarSvg(['#dc2626', '#991b1b'], '🌊', 'นัทธพงศ์')
  },
  {
    id: 'k15',
    name: 'แพรวา & พลอย',
    wish: 'ขอให้มิตรภาพของเพื่อนซี้คงอยู่ตลอดไป ไม่ว่าจะอยู่ที่ไหนก็ตาม',
    style: 'pink_lotus',
    votes: 145,
    photo: createAvatarSvg(['#f472b6', '#db2777'], '👭', 'แพรวา')
  },
  {
    id: 'k16',
    name: 'เชฟธันวา ครัวสยาม',
    wish: 'ขอให้อาหารไทยดังไกลทั่วโลก ผู้คนมีความสุขกับรสชาติที่ตั้งใจปรุง',
    style: 'golden_glory',
    votes: 99,
    photo: createAvatarSvg(['#f59e0b', '#b45309'], '🍲', 'เชฟธันวา')
  },
  {
    id: 'k17',
    name: 'น้องมายด์ ชลธิชา',
    wish: 'ขอให้หัวใจสงบ ร่มเย็นดั่งสายน้ำ ปล่อยวางความทุกข์ทั้งปวง',
    style: 'royal_purple',
    votes: 120,
    photo: createAvatarSvg(['#9333ea', '#6b21a8'], '🧘', 'มายด์')
  },
  {
    id: 'k18',
    name: 'กัปตัน วินัย',
    wish: 'ขอให้ทุกการเดินทางปลอดภัย แคล้วคลาดจากอุปสรรคทั้งปวง',
    style: 'banana_leaf',
    votes: 84,
    photo: createAvatarSvg(['#0284c7', '#0369a1'], '⚓', 'กัปตัน')
  },
  {
    id: 'k19',
    name: 'เบลล์ จิดาภา',
    wish: 'ขอให้ปีนี้เต็มไปด้วยโอกาสใหม่ๆ และความกล้าหาญในการทำตามฝัน',
    style: 'siam_ruby',
    votes: 138,
    photo: createAvatarSvg(['#e11d48', '#9f1239'], '✨', 'เบลล์')
  },
  {
    id: 'k20',
    name: 'หมออารีย์ ชุมชนสุขใจ',
    wish: 'ขอให้ทุกคนห่างไกลโรคภัยไข้เจ็บ มีสุขภาพใจและกายที่เบิกบาน',
    style: 'banana_leaf',
    votes: 195,
    photo: createAvatarSvg(['#14b8a6', '#0f766e'], '🩺', 'หมออารีย์')
  }
];
