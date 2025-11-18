import { getAuthenticatedUser, getUncachableGitHubClient, getRepository } from './server/github';
import fs from 'fs';
import { globSync } from 'glob';

async function getAllFiles(): Promise<string[]> {
  const files = globSync('**/*', {
    ignore: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      '.replit',
      'replit.nix',
      '*.log',
      '.env*',
      'sync-to-github*.ts',
      'attached_assets/**',
      'migrations/**',
      '.config/**',
      '.cache/**',
      'package-lock.json'
    ],
    nodir: true,
    dot: false
  });
  
  return files.filter(file => {
    const stats = fs.statSync(file);
    return stats.isFile() && stats.size < 10 * 1024 * 1024;
  });
}

async function uploadFile(octokit: any, owner: string, repo: string, filePath: string) {
  const content = fs.readFileSync(filePath, { encoding: 'base64' });
  
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Add ${filePath}`,
      content,
      branch: 'main'
    });
    return true;
  } catch (error: any) {
    console.error(`   ❌ Failed to upload ${filePath}:`, error.message);
    return false;
  }
}

async function syncToGitHub() {
  try {
    console.log('🔐 Getting GitHub user information...');
    const user = await getAuthenticatedUser();
    console.log(`✅ Authenticated as: ${user.login}`);

    const repoName = 'ClinLink';

    console.log(`\n📦 Accessing repository "${repoName}"...`);
    const repo = await getRepository(user.login, repoName);
    console.log(`✅ Found repository!`);
    console.log(`   URL: ${repo.html_url}`);

    const octokit = await getUncachableGitHubClient();
    
    console.log('\n📂 Collecting files to upload...');
    const files = await getAllFiles();
    console.log(`   Found ${files.length} files to upload`);

    console.log('\n📤 Uploading files to GitHub...');
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      process.stdout.write(`   [${i + 1}/${files.length}] ${file}...`);
      
      const success = await uploadFile(octokit, user.login, repoName, file);
      if (success) {
        console.log(' ✓');
        successCount++;
      } else {
        console.log(' ✗');
        failCount++;
      }
      
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n✅ Upload complete!`);
    console.log(`   Successful: ${successCount}/${files.length}`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount}/${files.length}`);
    }
    console.log(`\n📍 Repository URL: ${repo.html_url}`);

  } catch (error: any) {
    console.error('\n❌ Error syncing to GitHub:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    process.exit(1);
  }
}

syncToGitHub();
