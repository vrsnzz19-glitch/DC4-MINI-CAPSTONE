$ErrorActionPreference = 'Stop'

$backendPath = Join-Path $PSScriptRoot '..\backend'
$environmentPath = Join-Path $backendPath '.env'

if (-not (Test-Path $environmentPath)) {
    throw "Backend .env was not found. Create it from backend\.env.example first."
}

$settings = @{}
foreach ($line in Get-Content $environmentPath) {
    if ($line -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') {
        $value = $Matches[2].Trim()
        if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        $settings[$Matches[1]] = $value
    }
}

if ($settings['DB_CONNECTION'] -ne 'mysql') {
    throw "This setup script requires DB_CONNECTION=mysql in backend\.env."
}

& php -r "exit(extension_loaded('pdo_mysql') ? 0 : 1);"
if ($LASTEXITCODE -ne 0) {
    throw 'PHP extension pdo_mysql is not enabled for the active PHP CLI. Enable it in that PHP version''s php.ini, restart the terminal, and rerun this script.'
}

$databaseName = $settings['DB_DATABASE']
if ([string]::IsNullOrWhiteSpace($databaseName) -or $databaseName -notmatch '^[A-Za-z0-9_]+$') {
    throw 'DB_DATABASE must contain only letters, numbers, and underscores.'
}

$mysqlCommand = Get-Command mysql.exe -ErrorAction SilentlyContinue
if ($mysqlCommand) {
    $mysqlPath = $mysqlCommand.Source
} else {
    $mysqlRoot = 'C:\laragon\bin\mysql'
    $mysqlPath = Get-ChildItem $mysqlRoot -Directory -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        ForEach-Object { Join-Path $_.FullName 'bin\mysql.exe' } |
        Where-Object { Test-Path $_ } |
        Select-Object -First 1
}

if (-not $mysqlPath) {
    throw 'mysql.exe was not found. Start MySQL in Laragon and add its bin folder to PATH.'
}

$dbHost = if ($settings['DB_HOST']) { $settings['DB_HOST'] } else { '127.0.0.1' }
$dbPort = if ($settings['DB_PORT']) { $settings['DB_PORT'] } else { '3306' }
$dbUser = if ($settings['DB_USERNAME']) { $settings['DB_USERNAME'] } else { 'root' }
$mysqlArguments = @("--host=$dbHost", "--port=$dbPort", "--user=$dbUser")

if (-not [string]::IsNullOrEmpty($settings['DB_PASSWORD'])) {
    Write-Host 'MySQL will prompt for the password configured in backend\.env.'
    $mysqlArguments += '--password'
}

$createDatabaseSql = "CREATE DATABASE IF NOT EXISTS ``$databaseName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$mysqlArguments += "--execute=$createDatabaseSql"
& $mysqlPath @mysqlArguments
if ($LASTEXITCODE -ne 0) {
    throw "MySQL could not create or verify database '$databaseName'. Check that MySQL is running and the backend DB settings are correct."
}

Push-Location $backendPath
try {
    & php artisan optimize:clear
    if ($LASTEXITCODE -ne 0) {
        throw 'Laravel could not clear cached configuration. Check the backend installation.'
    }

    & php artisan migrate --seed
    if ($LASTEXITCODE -ne 0) {
        throw 'Laravel migrations or seeders failed. Review the Artisan output above.'
    }
} finally {
    Pop-Location
}

Write-Host "Database '$databaseName' is ready and migrations/seeders completed."
