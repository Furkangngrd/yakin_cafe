import { MongoMemoryServer } from 'mongodb-memory-server';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  console.log("⏳ Bellek-içi (In-Memory) MongoDB başlatılıyor...");
  console.log("(İlk çalıştırmada MongoDB binary'si indirileceği için biraz sürebilir)");
  
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log(`✅ MongoDB Memory Server şu adreste çalışıyor: ${uri}`);
  
  // Ortam değişkenini bellekteki veritabanı ile eziyoruz
  process.env.MONGODB_URI = uri;

  console.log("🌱 Overpass API Seeder çalıştırılıyor (Gerçek veriler çekiliyor)...");
  try {
    // Seeder'ı çalıştır
    execSync('node seed-overpass.js', { stdio: 'inherit', env: process.env });
    console.log("✅ Seeding işlemi tamamlandı.");
  } catch (error) {
    console.error("❌ Seeding başarısız oldu, ancak sunucu başlatılmaya devam ediliyor...");
  }

  console.log("🚀 Fastify Backend Sunucusu Başlatılıyor...");
  // Uygulamanın ana giriş noktasını yükleyerek başlatıyoruz
  await import('./src/app.js');
}

start().catch(err => {
  console.error("Başlatma sırasında kritik hata:", err);
  process.exit(1);
});
