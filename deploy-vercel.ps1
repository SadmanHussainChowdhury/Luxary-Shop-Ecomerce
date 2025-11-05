# Vercel Deployment Script
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Vercel Deployment Script" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "Found .env.local file" -ForegroundColor Green
    Write-Host "Make sure to add these environment variables to Vercel:" -ForegroundColor Yellow
    Write-Host ""
    Get-Content .env.local | Select-String -Pattern "^[A-Z]" | ForEach-Object {
        $line = $_.Line
        if ($line -match "^([^=]+)=(.*)$") {
            $key = $matches[1]
            Write-Host "  - $key" -ForegroundColor Cyan
        }
    }
    Write-Host ""
} else {
    Write-Host "No .env.local found. Make sure to set up environment variables in Vercel." -ForegroundColor Yellow
}

Write-Host "Starting Vercel deployment..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This will:" -ForegroundColor White
Write-Host "1. Open Vercel authentication in your browser" -ForegroundColor White
Write-Host "2. Link your project to Vercel" -ForegroundColor White
Write-Host "3. Deploy your project" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to continue..." -ForegroundColor Yellow
Read-Host

# Deploy to Vercel
npx vercel --prod

