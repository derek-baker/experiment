Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

$requestScriptBlock = { 
    param(
        [string] $url,
        [string] $logfile
    )
    # Invoke-RestMethod -Method GET -Uri $url -Verbose `
    $time = [DateTimeOffset]::Now.ToUnixTimeSeconds()
    Out-File -InputObject $time -FilePath $logfile -Append -Force
}

function getTimestamp() {
    return [DateTimeOffset]::Now.ToUnixTimeSeconds()
}

function cleanOldLogs([string] $logDir) {
    Get-ChildItem -Path $logDir -Recurse | ForEach-Object {
         Remove-Item -Path $_.FullName -Force -Verbose
    }
}

function RunScenarioA(
    [string] $serverUrl,
    [int] $maxRequestsPerSec = 10,
    [int] $priority = $null,
    [int] $runtimeSecs = 5,
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
        # Get-Job -State Completed `
        #     | Receive-Job -Wait `
        #         | Out-File -Append -FilePath "$PSScriptRoot\Logs\job-log.txt"
        
    }    
    # Get-Job | Wait-Job    
}

# function RunScenarioB(
#     [int] $requestRate,
#     [int] $priority = 1
# ) {

# }

# function RunScenarioC(
#     [int] $requestRate
# ) {
#     [int] $priority
# }

Export-ModuleMember -Function *