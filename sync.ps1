# 1. FIX HTML DOCTYPE
Get-ChildItem -Filter index.html -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName
    if ($content -and $content[0] -match "XHTML") {
        $content[0] = "<!DOCTYPE html>"
        $content | Set-Content $_.FullName
        Write-Host "Fixed HTML: $($_.FullName)" -ForegroundColor Green
    }
}

# 2. SYNC CURRENT DIRECTORY
Write-Host "Syncing Admin OS Project: Ranstar Thirteen El Bey..." -ForegroundColor Cyan

git add .
$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm"
git commit -m "Admin OS System Sync: $timestamp"

# Force push since we just initialized the repository
git push -u origin main --force

Write-Host "Running Vite Build..." -ForegroundColor Yellow
npm run build

Write-Host "SUCCESS: System Synced to GitHub. Closing in 5 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 5