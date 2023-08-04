const axios = require('axios');
const fs = require('fs');
const path = require('path');

const languages = {
  // 'c': 'c',
  // 'cpp': 'cpp',
  // 'html': 'html',
  // 'java': 'java',
  // 'javascript': 'js',
  // 'python': 'py',
  // 'typescript': 'ts',
  // 'csharp': 'cs',
  // 'go': 'go',
  // 'kotlin': 'kt',
  // 'jsx' : 'jsx',
}

const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.GITHUB_TOKEN;

console.log("secret key", SECRET_KEY)

async function searchFilesForLanguage(language, languageFolder) {
  const searchResponse = await axios.get(`https://api.github.com/search/code?q=extension:${language}`, {
    headers: {
      'Authorization': `token ${SECRET_KEY}`
    }
  });

  // Iterate over the items
  for (const item of searchResponse.data.items) {
    if (item.path.endsWith('.' + language)) {
      console.log(`Found .${language} file:`, item.path);
      // Fetch the file
      console.log("url", item.url)
      const fileResponse = await axios.get(item.url, {
        headers: {
          'Authorization': `token ${SECRET_KEY}`,
          'Accept': 'application/vnd.github.VERSION.raw'  // Get the raw content
        }
      });

      const content = fileResponse.data

      // Create a directory if it does not exist
      const dir = `D:\\Code_Typing_Game\\scraper\\Files\\${languageFolder}`
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write to a file
      const filePath = path.join(dir, path.basename(item.path));
      fs.writeFileSync(filePath, content);
      console.log('Saved file:', filePath);
    }
  }
}

async function searchFiles() {
  // Map over the keys of the languages object and call searchFilesForLanguage for each
  const promises = Object.entries(languages).map(([key, value]) => searchFilesForLanguage(value, key));
  // Use Promise.all to await all of the promises at once
  await Promise.all(promises);
}

searchFiles().catch(console.error);
