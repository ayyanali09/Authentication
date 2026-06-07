param(
  [string]$Project = $(if ($env:VERCEL_PROJECT) { $env:VERCEL_PROJECT } else { "duron-media" }),
  [string]$Team = $env:VERCEL_TEAM,
  [string]$Domain = "duron.media",
  [string]$WwwCname = $(if ($env:VERCEL_WWW_CNAME) { $env:VERCEL_WWW_CNAME } else { "cname.vercel-dns-0.com" }),
  [switch]$UseSavedVercelLogin
)

$ErrorActionPreference = "Stop"

function Import-EnvFile {
  param([string]$Path)

  if (!(Test-Path -LiteralPath $Path)) {
    return
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if (!$line -or $line.StartsWith("#") -or !$line.Contains("=")) {
      return
    }

    $name, $value = $line.Split("=", 2)
    $name = $name.Trim()
    $value = $value.Trim().Trim('"').Trim("'")
    if ($name) {
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

function Invoke-Vercel {
  param([string[]]$Args)

  $baseArgs = @("--yes", "vercel@latest") + $Args
  if ($env:VERCEL_TOKEN -and !$UseSavedVercelLogin) {
    $baseArgs += @("--token", $env:VERCEL_TOKEN)
  }

  & npx.cmd @baseArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Vercel CLI command failed: vercel $($Args -join ' ')"
  }
}

Import-EnvFile -Path ".env.deploy.local"

$siteUrl = "https://$Domain"
$apiUrl = "https://api.$Domain/api/v1"
$webDir = "apps/web"
$vercelScopeArgs = @()

if ($Team) {
  $vercelScopeArgs += @("--team", $Team)
}

Write-Host "Checking Vercel authentication"
Invoke-Vercel @("whoami")

Write-Host "Linking Vercel project: $Project"
Invoke-Vercel (@("link", "--cwd", $webDir, "--yes", "--project", $Project) + $vercelScopeArgs)

Write-Host "Setting Vercel production environment variables"
Invoke-Vercel @("env", "add", "NEXT_PUBLIC_SITE_URL", "production", "--value", $siteUrl, "--yes", "--force", "--no-sensitive", "--cwd", $webDir)
Invoke-Vercel @("env", "add", "NEXT_PUBLIC_API_URL", "production", "--value", $apiUrl, "--yes", "--force", "--no-sensitive", "--cwd", $webDir)

Write-Host "Building Vercel output locally"
Invoke-Vercel @("build", "--prod", "--cwd", $webDir, "--project", $Project)

Write-Host "Deploying prebuilt output to production"
Invoke-Vercel @("deploy", "--prebuilt", "--prod", "--cwd", $webDir, "--project", $Project)

Write-Host "Adding Vercel domains"
Invoke-Vercel @("domains", "add", $Domain, $Project)
Invoke-Vercel @("domains", "add", "www.$Domain", $Project)
Invoke-Vercel @("domains", "inspect", $Domain)
Invoke-Vercel @("domains", "inspect", "www.$Domain")

if (!$env:HOSTINGER_API_TOKEN) {
  Write-Host "HOSTINGER_API_TOKEN is not set; skipping Hostinger DNS API update."
  Write-Host "Set HOSTINGER_API_TOKEN in .env.deploy.local to update DNS automatically."
  exit 0
}

$headers = @{
  Authorization = "Bearer $env:HOSTINGER_API_TOKEN"
  "Content-Type" = "application/json"
}

$dnsBody = @{
  overwrite = $true
  zone = @(
    @{
      name = "@"
      type = "A"
      ttl = 300
      records = @(@{ content = "76.76.21.21" })
    },
    @{
      name = "www"
      type = "CNAME"
      ttl = 300
      records = @(@{ content = $WwwCname })
    }
  )
} | ConvertTo-Json -Depth 8

$dnsEndpoint = "https://developers.hostinger.com/api/dns/v1/zones/$Domain"

Write-Host "Validating Hostinger DNS update"
Invoke-RestMethod -Method Post -Uri "$dnsEndpoint/validate" -Headers $headers -Body $dnsBody | Out-Null

Write-Host "Updating Hostinger DNS records for $Domain"
Invoke-RestMethod -Method Put -Uri $dnsEndpoint -Headers $headers -Body $dnsBody | Out-Null

Write-Host "Done. DNS propagation can take a few minutes and up to 24 hours."
