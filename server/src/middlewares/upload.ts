import multer from "multer";
import fs from "fs";

// 1. Define onde os ficheiros vão ser guardados
const uploadDir = "server/uploads";

// 2. Cria a pasta automaticamente se ela ainda não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Configura o Multer (Onde guardar e que nome dar ao ficheiro)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    // Gera um nome único para evitar que dois ficheiros com o mesmo nome se substituam
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Remove espaços do nome original do ficheiro para evitar erros em URLs
    const cleanName = file.originalname.replace(/\s+/g, '_');
    
    cb(null, uniqueSuffix + '-' + cleanName);
  }
});

// 4. Exporta a configuração com um limite de tamanho (ex: 5MB)
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Megabytes
});