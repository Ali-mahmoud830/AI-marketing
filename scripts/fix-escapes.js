const fs = require('fs');
const path = require('path');

const files = [
  "src/app/api/marketing/spy/route.ts",
  "src/app/api/marketing/generation/route.ts",
  "src/app/api/marketing/autopilot/route.ts",
  "src/app/api/marketing/crm/route.ts"
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/error\.errors/g, 'error.issues');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ZodError in ${file}`);
  }
}
