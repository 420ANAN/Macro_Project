Param(
  [string]$MysqlHost,
  [int]$MysqlPort = 3306,
  [string]$MysqlUser,
  [string]$MysqlPassword,
  [string]$MysqlDatabase,
  [string]$JwtSecret,
  [switch]$NoPrompt
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Msg) {
  Write-Host ""
  Write-Host "==> $Msg"
}

function Require-Cmd([string]$Cmd, [string]$Help) {
  if (-not (Get-Command $Cmd -ErrorAction SilentlyContinue)) {
    throw "Missing required command '$Cmd'. $Help"
  }
}

function Ensure-NpmInstall([string]$Dir) {
  if (-not (Test-Path $Dir -PathType Container)) { throw "Directory not found: $Dir" }
  $nodeModules = Join-Path $Dir "node_modules"
  if (-not (Test-Path $nodeModules)) {
    Write-Step "Installing dependencies in $Dir"
    Push-Location $Dir
    try { npm install } finally { Pop-Location }
  }
}

function Read-Value([string]$Prompt, [string]$Default = "", [switch]$Secret) {
  if ($NoPrompt) { return $Default }
  if ($Secret) {
    $secure = Read-Host -Prompt $Prompt -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
  }
  $v = Read-Host -Prompt $Prompt
  if ([string]::IsNullOrWhiteSpace($v)) { return $Default }
  return $v
}

Require-Cmd "node" "Install Node.js (LTS) first."
Require-Cmd "npm" "Install Node.js (LTS) first."

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$backendDir = Join-Path $root "backend"
$frontendDir = $root
$backendEnvPath = Join-Path $backendDir ".env"

Write-Step "Preparing configuration"
if (-not (Test-Path $backendEnvPath)) {
  New-Item -ItemType File -Path $backendEnvPath -Force | Out-Null
}

$existingEnv = Get-Content $backendEnvPath -ErrorAction SilentlyContinue
$hasMysqlHost = ($existingEnv | Select-String -Pattern '^\s*MYSQL_HOST\s*=' -Quiet)
$hasMysqlUser = ($existingEnv | Select-String -Pattern '^\s*MYSQL_USER\s*=' -Quiet)
$hasMysqlDb = ($existingEnv | Select-String -Pattern '^\s*MYSQL_DATABASE\s*=' -Quiet)

if (-not $MysqlHost) { $MysqlHost = Read-Value "MySQL host (default: localhost)" "localhost" }
if (-not $MysqlUser) { $MysqlUser = Read-Value "MySQL user (default: root)" "root" }
if (-not $MysqlPassword) { $MysqlPassword = Read-Value "MySQL password (will not echo)" "" -Secret }
if (-not $MysqlDatabase) { $MysqlDatabase = Read-Value "MySQL database name (example: maco_erp)" "" }
if (-not $JwtSecret) { $JwtSecret = Read-Value "JWT secret (default: super_secret_change_me_in_production)" "super_secret_change_me_in_production" }

if ((-not $hasMysqlHost -or -not $hasMysqlUser -or -not $hasMysqlDb) -and [string]::IsNullOrWhiteSpace($MysqlDatabase)) {
  throw "MYSQL_DATABASE is required. Re-run and provide -MysqlDatabase or enter it when prompted."
}

$envLines = @(
  "# Server Configuration"
  "PORT=3000"
  ""
  "# MySQL Connection (local)"
  "MYSQL_HOST=$MysqlHost"
  "MYSQL_PORT=$MysqlPort"
  "MYSQL_USER=$MysqlUser"
  "MYSQL_PASSWORD=$MysqlPassword"
  "MYSQL_DATABASE=$MysqlDatabase"
  "MYSQL_SSL=0"
  ""
  "# JWT signing secret"
  "JWT_SECRET=$JwtSecret"
  ""
)

Set-Content -Path $backendEnvPath -Value $envLines -Encoding UTF8
Write-Host "Wrote $backendEnvPath"

Write-Step "Installing dependencies (if needed)"
Ensure-NpmInstall $backendDir
Ensure-NpmInstall $frontendDir

Write-Step "Starting backend and frontend"
$backendCmd = "cd `"$backendDir`"; npm start"
$frontendCmd = "cd `"$frontendDir`"; npm run dev"

Start-Process -FilePath "powershell" -ArgumentList @("-NoExit","-Command",$backendCmd) -WorkingDirectory $backendDir | Out-Null
Start-Process -FilePath "powershell" -ArgumentList @("-NoExit","-Command",$frontendCmd) -WorkingDirectory $frontendDir | Out-Null

Write-Host ""
Write-Host "Backend:  http://localhost:3000"
Write-Host "Frontend: check the Vite URL printed in the frontend terminal"
