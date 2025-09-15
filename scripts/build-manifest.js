// scripts/build-manifest.js
import fs from 'fs';
import path from 'path';

const booksDirectory = path.join(process.cwd(), 'public', 'books');
const manifestPath = path.join(booksDirectory, 'manifest.json');

try {
  // Get all subdirectories in the /public/books folder
  const bookFolders = fs.readdirSync(booksDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const libraryManifest = [];

  for (const bookId of bookFolders) {
    const indexPath = path.join(booksDirectory, bookId, 'index.json');
    
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      const bookIndex = JSON.parse(indexContent);

      // We only need a subset of the data for the manifest
      libraryManifest.push({
        id: bookId, // The folder name is the ID
        title: bookIndex.title,
        author: bookIndex.author,
        description: bookIndex.description,
        cover: bookIndex.cover || null, // Handle optional cover
      });
    } else {
      console.warn(`⚠️ Warning: No index.json found in /public/books/${bookId}`);
    }
  }

  // Write the generated array to manifest.json
  fs.writeFileSync(manifestPath, JSON.stringify(libraryManifest, null, 2));

  console.log(`✅ Successfully generated manifest.json with ${libraryManifest.length} books.`);

} catch (error) {
  console.error('❌ Error building the book manifest:', error);
  process.exit(1); // Exit with an error code
}