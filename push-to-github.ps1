# PowerShell script to push project to GitHub
# Make sure you have created a GitHub repository first!

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "GitHub Push Script" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to change it? (y/n)"
    if ($overwrite -eq 'y') {
        Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Green
        Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Gray
        $repoUrl = Read-Host "GitHub URL"
        if ($repoUrl) {
            git remote set-url origin $repoUrl
            Write-Host "Remote updated successfully!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Green
    Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Gray
    Write-Host ""
    Write-Host "If you haven't created a repository yet:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Create a new repository (don't initialize with README)" -ForegroundColor Cyan
    Write-Host "3. Copy the repository URL and paste it below" -ForegroundColor Cyan
    Write-Host ""
    $repoUrl = Read-Host "GitHub URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "Remote added successfully!" -ForegroundColor Green
    } else {
        Write-Host "No URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Set branch to main
Write-Host ""
Write-Host "Setting branch to 'main'..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "Success! Your project has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Red
    Write-Host "Error: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. You have created a GitHub repository" -ForegroundColor Yellow
    Write-Host "2. You have the correct permissions" -ForegroundColor Yellow
    Write-Host "3. You are authenticated with GitHub" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Red
}

