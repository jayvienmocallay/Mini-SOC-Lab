# Mini SOC Lab — Deploy Sysmon Configuration to Windows Endpoint
# SRS: SRS-SOC-2026-001 v1.0
#
# Usage: .\scripts\deploy-sysmon.ps1 [-EndpointIP "192.168.56.10"]
# Requires: WinRM enabled on target, admin credentials

param(
    [string]$EndpointIP = "192.168.56.10",
    [string]$SysmonConfigPath = "$PSScriptRoot\..\configs\sysmon\sysmonconfig.xml"
)

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Mini SOC Lab - Sysmon Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target Endpoint: $EndpointIP"
Write-Host "Config File:     $SysmonConfigPath"
Write-Host ""

# Validate config exists
if (-not (Test-Path $SysmonConfigPath)) {
    Write-Error "Sysmon config not found at: $SysmonConfigPath"
    exit 1
}

$confirm = Read-Host "Deploy Sysmon config to ${EndpointIP}? (y/N)"
if ($confirm -ne 'y') {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

$cred = Get-Credential -Message "Enter admin credentials for $EndpointIP"

Write-Host ""
Write-Host "[1/4] Creating remote session..." -ForegroundColor Green
$session = New-PSSession -ComputerName $EndpointIP -Credential $cred

Write-Host "[2/4] Copying Sysmon config to endpoint..." -ForegroundColor Green
Copy-Item -Path $SysmonConfigPath -Destination "C:\Windows\sysmonconfig.xml" -ToSession $session

Write-Host "[3/4] Installing/updating Sysmon on endpoint..." -ForegroundColor Green
Invoke-Command -Session $session -ScriptBlock {
    $sysmonPath = "C:\Windows\Sysmon64.exe"
    if (Test-Path $sysmonPath) {
        Write-Host "  Sysmon found — updating configuration..."
        & $sysmonPath -c "C:\Windows\sysmonconfig.xml"
    } else {
        Write-Host "  Sysmon not found — please install Sysmon first:"
        Write-Host "    Download from: https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon"
        Write-Host "    Install: sysmon64.exe -accepteula -i C:\Windows\sysmonconfig.xml"
    }
}

Write-Host "[4/4] Verifying Sysmon service status..." -ForegroundColor Green
Invoke-Command -Session $session -ScriptBlock {
    $svc = Get-Service -Name Sysmon64 -ErrorAction SilentlyContinue
    if ($svc -and $svc.Status -eq "Running") {
        Write-Host "  [OK] Sysmon64 service is running." -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Sysmon64 service is not running." -ForegroundColor Yellow
    }
}

Remove-PSSession $session
Write-Host ""
Write-Host "[SUCCESS] Sysmon configuration deployed to $EndpointIP" -ForegroundColor Green
