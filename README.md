# 🪷 งานลอยกระทงออนไลน์ 3D & ระบบโหวตประกวดกระทง
### (Loy Krathong 3D Festival & Real-time Online Voting Web App)

เว็บแอปพลิเคชัน 3D บรรยากาศงานเทศกาลลอยกระทงคืนวันเพ็ญ พร้อมระบบเปิดกล้องถ่ายรูปเซลฟี่ ปล่อยกระทงลงสู่แม่น้ำ และโหวตให้คะแนนผู้เข้าประกวดแบบเรียลไทม์ รองรับทั้ง PC, Tablet และ Smartphone

---

## ✨ ฟีเจอร์หลัก (Key Features)

1. **ฉาก 3D เสมือนจริงด้วย Three.js (Full 3D Atmosphere):**
   - **แม่น้ำ (River):** ผิวน้ำเคลื่อนไหวแบบ Real-time Wave Animation สะท้อนแสงจันทร์และแสงเทียน
   - **ดวงจันทร์เต็มดวง (Full Moon):** ส่องสว่างพร้อมทรงกลด (Halo Bloom) และท้องฟ้าประดับดาว
   - **สถาปัตยกรรมไทย:** พระอุโบสถวัดไทยหลังคาซ้อนชั้น, เจดีย์ทองอร่าม (Golden Chedi) และเรือนไทยไม้สักยกพื้นสูง
   - **บรรยากาศงานเทศกาล:** โคมลอยส่องสว่างลอยสู่ท้องฟ้า และผู้คน 20 คนเดินและยืนชมงานริมตลิ่ง
   - **กระทงในแม่น้ำ:** กระทง 20 ใบแรกพร้อมแสงเทียนกระพริบ (Flickering Candle) ลอยตามกระแสน้ำ

2. **การควบคุมมุมกล้อง 360 องศา (OrbitControls):**
   - รองรับ Mouse Drag, Scroll Zoom บนคอมพิวเตอร์
   - รองรับ Single Touch และ Pinch to Zoom บนหน้าจอมือถือและแท็บเล็ต
   - ป้องกันกล้องมุดใต้ผิวน้ำ พร้อมปุ่มรีเซ็ตมุมมอง

3. **ระบบถ่ายรูป & ปล่อยกระทงประกวด (Interactive Krathong Creator):**
   - เปิดกล้องหน้า/กล้องหลังถ่ายรูปสด (WebRTC Live Camera) หรืออัปโหลดภาพจากเครื่อง
   - **ระบบบีบอัดรูปภาพอัตโนมัติ:** ควบคุมขนาดภาพให้ไม่เกิน 500KB ก่อนบันทึก
   - ป้อนชื่อผู้เข้าประกวดและคำอธิษฐานในคืนวันเพ็ญ
   - เลือกรูปแบบกระทง 3D ได้ 5 สไตล์ (ใบตองมรกต, บัวชมพู, สุพรรณิการ์ทองคำ, อัญชันมงคล, ทับทิมสยาม)
   - ปล่อยกระทงลงสู่แม่น้ำจริง พร้อมมุมกล้องบินไปโฟกัสให้อัตโนมัติ

4. **ระบบโหวตคะแนน 3D (Raycasting Interactive Voting):**
   - แตะหรือคลิกที่กระทงใดก็ได้ในแม่น้ำ เพื่อเปิดดูรูปถ่ายและคำอธิษฐานของเจ้าของ
   - กติกา **"1 คน 1 สิทธิ์โหวต"** ป้องกันการปั๊มโหวตซ้ำ
   - เอฟเฟกต์เสียงกระดิ่งไทย (Web Audio API Synthesizer) และ Confetti เฉลิมฉลอง

5. **Cloud Database (Firebase Firestore):**
   - เชื่อมต่อ Cloud Firestore เพื่อซิงก์ข้อมูลกระทงและคะแนนโหวตแบบ Real-time ทุกอุปกรณ์

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19, Vite 8, Tailwind CSS, Lucide React
- **3D Graphics:** Three.js (WebGL Engine, OrbitControls, Shaders, Raycasting)
- **Database:** Firebase Firestore (Real-time synchronization)
- **Audio:** Web Audio API Procedural Synthesizer (ดนตรีไทยบรรเลงและเสียงกระดิ่ง)
- **FX:** Canvas Confetti

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/JJYindee/Loy_Kathong_Festival.git
   cd Loy_Kathong_Festival
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables:**
   คัดลอกไฟล์ `.env.example` เป็น `.env` และกรอก Firebase Config ของคุณ:
   ```bash
   cp .env.example .env
   ```

4. **เริ่มรันโปรเจกต์:**
   ```bash
   npm run dev
   ```
   เปิดบราวเซอร์ไปที่ `http://localhost:5173`

---

## 📦 การ Build สำหรับ Production

```bash
npm run build
```
ไฟล์สำหรับ Deploy จะถูกสร้างไว้ที่โฟลเดอร์ `dist/`
