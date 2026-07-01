const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'frontend', 'src', 'locales', 'index.js');
let fileContent = fs.readFileSync(localesPath, 'utf8');

const translationsToAdd = {
  tr: { doctor_requests: "Doktor İstekleri" },
  en: { doctor_requests: "Doctor Requests" },
  de: { doctor_requests: "Arztanfragen" },
  fr: { doctor_requests: "Demandes Médecin" },
  es: { doctor_requests: "Solicitudes de Doctores" },
  ru: { doctor_requests: "Запросы Врачей" },
  ar: { doctor_requests: "طلبات الأطباء" },
  zh: { doctor_requests: "医生请求" }
};

let match;
const regex = /([a-z]{2}):\s*\{([\s\S]*?)\}/g;
let newContent = fileContent;

while ((match = regex.exec(fileContent)) !== null) {
  const lang = match[1];
  const block = match[2];
  
  if (translationsToAdd[lang]) {
    let keysToAdd = [];
    for (const [key, value] of Object.entries(translationsToAdd[lang])) {
      if (!block.includes(`\n    ${key}:`) && !block.includes(`\n    "${key}":`)) {
        keysToAdd.push(`    ${key}: "${value}"`);
      }
    }
    if (keysToAdd.length > 0) {
      const insertion = ',\n' + keysToAdd.join(',\n');
      const langRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)(\\n\\s*\\})`);
      newContent = newContent.replace(langRegex, `$1${insertion}$2`);
    }
  }
}

fs.writeFileSync(localesPath, newContent);
console.log('Translations updated.');
