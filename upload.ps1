# =========================================================
#  Laedt die Website zum Hoster hoch (Ordner /neu) – per SFTP.
#  Bedienung in VS Code:  Rechtsklick auf upload.ps1 -> "Run with PowerShell"
#  Das SFTP-Passwort wird beim Start abgefragt (nicht gespeichert).
#  HINWEIS: SFTP-Host/User/Remote unten bitte auf den ImmoInsel-Hoster anpassen.
# =========================================================
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

# --- Zugangsdaten (kein Passwort hier!) ---
$SftpHost = '[SFTP-HOST-EINSETZEN]'
$SftpUser = '[SFTP-USER-EINSETZEN]'
$SftpPort = 22
$Remote   = '/neu'

# --- Posh-SSH sicherstellen ---
if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
  Write-Host "Installiere benoetigtes Modul 'Posh-SSH' ..." -ForegroundColor Yellow
  try { Set-PSRepository -Name PSGallery -InstallationPolicy Trusted -ErrorAction SilentlyContinue } catch {}
  Install-Module Posh-SSH -Scope CurrentUser -Force
}
Import-Module Posh-SSH

# --- Live-Dateien in einen sauberen Zwischenordner kopieren (ohne _quellen, .git usw.) ---
$stage = Join-Path $env:TEMP 'immoinsel-deploy'
Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $stage | Out-Null
foreach ($f in 'index.html','impressum.html','datenschutz.html','robots.txt','sitemap.xml','favicon.ico') {
  if (Test-Path (Join-Path $PSScriptRoot $f)) { Copy-Item (Join-Path $PSScriptRoot $f) $stage }
}
foreach ($d in 'css','js','fonts','img') {
  if (Test-Path (Join-Path $PSScriptRoot $d)) { Copy-Item (Join-Path $PSScriptRoot $d) $stage -Recurse }
}
Remove-Item (Join-Path $stage 'img\_quellen') -Recurse -Force -ErrorAction SilentlyContinue

# --- Passwort abfragen ---
$pwSec = Read-Host "SFTP-Passwort fuer $SftpUser eingeben" -AsSecureString
$cred  = New-Object System.Management.Automation.PSCredential($SftpUser, $pwSec)

# --- Verbinden & hochladen ---
Write-Host "Verbinde mit $SftpHost ..." -ForegroundColor Cyan
$sess = New-SFTPSession -ComputerName $SftpHost -Port $SftpPort -Credential $cred -AcceptKey -ConnectionTimeout 40
$sid  = $sess.SessionId
if (-not (Test-SFTPPath -SessionId $sid -Path $Remote)) { New-SFTPItem -SessionId $sid -Path $Remote -ItemType Directory | Out-Null }

Get-ChildItem -LiteralPath $stage | ForEach-Object {
  Set-SFTPItem -SessionId $sid -Path $_.FullName -Destination $Remote -Force
  Write-Host "  hochgeladen: $($_.Name)" -ForegroundColor Green
}

Remove-SFTPSession -SessionId $sid | Out-Null
Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Fertig! Die Seite ist aktualisiert: https://www.immoinsel.de" -ForegroundColor Green
Write-Host "(Tipp: im Browser mit Strg+F5 neu laden)" -ForegroundColor DarkGray
