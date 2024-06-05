import fs from 'fs';
import { execSync } from "child_process";

async function getBuildInfo() {
  const info: { [key: string]: string } = {}

  // Get short commit hash
  const shortHash = execSync('git rev-parse --short HEAD')?.toString().trim();

  console.log("The current commit hash is: " + shortHash)
  info.shortHash = shortHash;


  // Get remote URL
  let remoteUrl = execSync('git config --get remote.origin.url')?.toString().trim();
  // Remove .git from the end of the URL so we can append the path to the commit
  if (remoteUrl.endsWith('.git')) {
    remoteUrl = remoteUrl.slice(0, -4);
  }
  if (!remoteUrl.endsWith('/')) {
    remoteUrl += '/';
  }
  console.log("The current remote URL is: " + remoteUrl)
  info.remoteURL = remoteUrl;


  // Write info to file
  fs.writeFile('src/lib/version.json', JSON.stringify(info), (err) => {
    if (err) throw err;
    console.log("Git-related build info has been saved")
  });
}

getBuildInfo();