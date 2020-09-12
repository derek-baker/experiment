Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

$requestScriptBlock = { 
    param(
        [Parameter(Mandatory=$true)]
        [string] $url,

        [Parameter(Mandatory=$true)]
        [string] $logfile
    )
    try {
        Invoke-RestMethod -Method GET -Uri $url -Verbose | `
            Out-File -FilePath $logfile -Append -Force        
    }
    catch {
        Out-File -InputObject $_ -FilePath $logfile -Append -Force
    }
}

function getTimestamp() {
    return [DateTimeOffset]::Now.ToUnixTimeSeconds()
}

function cleanOldLogs(
    [Parameter(Mandatory=$true)]
    [string] $logDir
) {
    Get-ChildItem -Path $logDir -Recurse | ForEach-Object {
         Remove-Item -Path $_.FullName -Force -Verbose
    }
}

function RunScenarioA(
    [Parameter(Mandatory=$true)]
    [string] $loadBalancerUrl,

    [Parameter(Mandatory=$false)]
    [int] $maxRequestsPerSec = 10,

    # [Parameter(Mandatory=$false)]
    # [int] $priority = $null,

    [Parameter(Mandatory=$false)]
    [int] $runtimeSecs = 5,

    [Parameter(Mandatory=$false)]
    [string] $logDir = "$PSScriptRoot\Logs"
) {
    cleanOldLogs -logDir $logDir

    [int] $start = getTimestamp
    [int] $intervalNum = getTimestamp
    [int] $requestsMadeInThisInterval = 0
    
    while ($true) {
        [int] $now = getTimestamp
        
        if ($now -ge ($start + $runtimeSecs)) {
            Write-Host "`nENDING SESSION."
            Write-Host "Started: $start"
            Write-Host "Ended: $($start + $runtimeSecs)"
            break
        }
        elseif (
            ($now -eq $intervalNum) `
            -and `
            ($requestsMadeInThisInterval -lt $maxRequestsPerSec)
        ) {
            $requestsMadeInThisInterval += 1

            Write-Host "Making request $requestsMadeInThisInterval in interval $intervalNum"

            $time = getTimestamp
            
            $logfile = "$logDir\$time.txt"
            Start-ThreadJob `
                -ScriptBlock $requestScriptBlock `
                -ArgumentList @($loadBalancerUrl, $logfile) | Out-Null
        }
        elseif ($requestsMadeInThisInterval -eq $maxRequestsPerSec) {
            $requestsMadeInThisInterval = 0
            $intervalNum += 1
            Write-Host "`n"
        }
    }    
    # Get-Job | Wait-Job    
}

function RunScenarioB(
    [Parameter(Mandatory=$true)]
    [string] $serverUrl,

    [Parameter(Mandatory=$false)]
    [int] $maxRequestsPerSec = 50,

    [Parameter(Mandatory=$false)]
    [int] $priority = 1,

    [Parameter(Mandatory=$false)]
    [int] $runtimeSecs = 5,

    [Parameter(Mandatory=$false)]
    [string] $logDir = "$PSScriptRoot\Logs"
) {
    cleanOldLogs -logDir $logDir

    [int] $start = getTimestamp
    [int] $intervalNum = getTimestamp
    [int] $requestsMadeInThisInterval = 0
    
    while ($true) {
        [int] $now = getTimestamp
        
        if ($now -ge ($start + $runtimeSecs)) {
            Write-Host "`nENDING SESSION."
            Write-Host "Started: $start"
            Write-Host "Ended: $($start + $runtimeSecs)"
            break
        }
        elseif (
            ($now -eq $intervalNum) `
            -and `
            ($requestsMadeInThisInterval -lt $maxRequestsPerSec)
        ) {
            $requestsMadeInThisInterval += 1

            Write-Host "Making request $requestsMadeInThisInterval in interval $intervalNum"

            $time = getTimestamp
            
            $logfile = "$logDir\$time.txt"
            Start-ThreadJob `
                -ScriptBlock $requestScriptBlock `
                -ArgumentList @($serverUrl, $logfile) | Out-Null
        }
        elseif ($requestsMadeInThisInterval -eq $maxRequestsPerSec) {
            $requestsMadeInThisInterval = 0
            $intervalNum += 1
            Write-Host "`n"
        }
    }    
    # Get-Job | Wait-Job    
}

# function RunScenarioC(
#     [int] $requestRate
# ) {
#     [int] $priority
# }

Export-ModuleMember -Function RunScenarioA