# =============================================================================
# export_windows.ps1
# Lessario Engine — Windows Export Script
#
# Usage:
#   .\export_windows.ps1                  # builds Release + packages ZIP
#   .\export_windows.ps1 -SkipBuild       # skip rebuild, just package
#   .\export_windows.ps1 -NoZip           # install only, skip ZIP
#
# Output:
#   export\windows\LessarioEngine.exe     (standalone, no MSVC redist needed)
#   export\windows\assets\               
#   export\LessarioEngine-0.1.0-win64.zip (distributable archive)
# =============================================================================

param(
    [switch]$SkipBuild = $false,
    [switch]$NoZip     = $false
)

$ErrorActionPreference = "Stop"

# ── Resolve paths ─────────────────────────────────────────────────────────────
$Root      = $PSScriptRoot
$BuildDir  = Join-Path $Root "build"
$ExportDir = Join-Path $Root "export\windows"
$CMake     = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe"

if (-not (Test-Path $CMake)) {
    # Fallback: try PATH
    $CMake = "cmake"
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Lessario Engine — Windows Export Pipeline  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Configure ─────────────────────────────────────────────────────────
if (-not $SkipBuild) {
    Write-Host "► [1/3] Configuring CMake (Release)..." -ForegroundColor Yellow
    & $CMake -S $Root -B $BuildDir -DCMAKE_BUILD_TYPE=Release | Out-Null
    if ($LASTEXITCODE -ne 0) { Write-Error "CMake configure failed."; exit 1 }

    # ── Step 2: Build ─────────────────────────────────────────────────────────
    Write-Host "► [2/3] Building Release configuration..." -ForegroundColor Yellow
    & $CMake --build $BuildDir --config Release --parallel
    if ($LASTEXITCODE -ne 0) { Write-Error "Build failed."; exit 1 }
} else {
    Write-Host "► Skipping build (--SkipBuild set)" -ForegroundColor DarkGray
}

# ── Step 3: Install ───────────────────────────────────────────────────────────
Write-Host "► [3/3] Installing to export\windows\ ..." -ForegroundColor Yellow
if (Test-Path $ExportDir) { Remove-Item $ExportDir -Recurse -Force }
& $CMake --install $BuildDir --config Release
if ($LASTEXITCODE -ne 0) { Write-Error "Install failed."; exit 1 }

# ── Step 4: Package ZIP ───────────────────────────────────────────────────────
if (-not $NoZip) {
    Write-Host "► [4/4] Packaging ZIP with CPack..." -ForegroundColor Yellow
    Push-Location $BuildDir
    & $CMake -E chdir $BuildDir cpack -C Release --config CPackConfig.cmake
    Pop-Location

    $zip = Get-ChildItem (Join-Path $Root "export") -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($zip) {
        Write-Host ""
        Write-Host "✅ Export complete!" -ForegroundColor Green
        Write-Host "   EXE   : export\windows\LessarioEngine.exe" -ForegroundColor White
        Write-Host "   ZIP   : $($zip.Name)" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "✅ Install complete (no ZIP)!" -ForegroundColor Green
    Write-Host "   EXE   : export\windows\LessarioEngine.exe" -ForegroundColor White
}

Write-Host ""
