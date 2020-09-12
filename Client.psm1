Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

$requestScriptBlock = { 
    param(
        $url,
        $logfile
    )
    Invoke-RestMethod -Method GET -Uri $url -Verbose `
        | Out-File -FilePath $logfile -Append
}

function getTimestamp() {
    return [DateTimeOffset]::Now.ToUnixTimeSeconds()
}

function RunScenarioA(
    [string] $serverUrl,
    [int] $maxRequestsPerSec = 5,
    [int] $priority = $null,
    [int] $runtimeSecs = 5
) {
    [int] $start = getTimestamp

    [int] $intervalNum = getTimestamp

    [int] $requestsMadeInThisInterval = 0
    # $jobs = @()

    while ($true) {
        [int] $now = getTimestamp
        Write-Host $now

        if (
            ($now -eq $intervalNum) `
            -and `
            ($requestsMadeInThisInterval -lt $maxRequestsPerSec)
        ) {
            Start-Job -ScriptBlock $requestScriptBlock -ArgumentList @($serverUrl, "$PSScriptRoot\Logs\A-log.txt")
            # $jobs += $job
            $requestsMadeInThisInterval += 1
        }
        else {
            $intervalNum += 1
        }   
        if ($now -gt ($start + $runtimeSecs)) {
            return
        }
    }
    Get-Job | Wait-Job
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