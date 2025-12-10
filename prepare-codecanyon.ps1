$target = "codecanyon_submission\source_code"
$root = "."

# Clean previous build
if (Test-Path "codecanyon_submission") {
    Remove-Item -Recurse -Force "codecanyon_submission"
}
New-Item -ItemType Directory -Force -Path $target

# Directories to copy
$dirs = @("app", "components", "hooks", "lib", "models", "public", "scripts", "types")

foreach ($dir in $dirs) {
    if (Test-Path "$root\$dir") {
        Write-Host "Copying $dir..."
        Copy-Item -Recurse -Path "$root\$dir" -Destination "$target\$dir"
    } else {
        Write-Warning "Directory $dir not found, skipping."
    }
}

# Files to copy
$files = @(
    "package.json", 
    "package-lock.json", 
    "tsconfig.json", 
    "tailwind.config.ts", 
    "postcss.config.js", 
    "next.config.mjs", 
    "middleware.ts", 
    "next-env.d.ts", 
    ".env.example", 
    ".gitignore", 
    "README.md", 
    "LICENSE", 
    "vercel.json"
)

# Documentation files
$docs = Get-ChildItem -Path $root -Filter "*.md" | Where-Object { $_.Name -ne "SETUP_COMPLETE.md" }
foreach ($doc in $docs) {
    $files += $doc.Name
}

foreach ($file in $files) {
    if (Test-Path "$root\$file") {
        Write-Host "Copying $file..."
        Copy-Item -Path "$root\$file" -Destination "$target\$file"
    }
}

Write-Host "Done! Files are in $target"
Write-Host "Please zip the 'codecanyon_submission' folder for upload."
