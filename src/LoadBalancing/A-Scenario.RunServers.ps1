# USAGE: pwsh <SCRIPT_PATH>.ps1
param(
    [Parameter(Mandatory=$false)]    
    [string] $serversScriptPath = "$PSScriptRoot/A-Scenario.StartServers.js",

    [Parameter(Mandatory=$false)]
    $loadBalancerPort = 8080,
    
    [Parameter(Mandatory=$false)]
    $ports = @($loadBalancerPort, 8081, 8082),

    [Parameter(Mandatory=$false)]
    [string] $node = 'node'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

[string] $errOut = $null
[string] $stdOut = $null

$command = $node + " " + $serversScriptPath

foreach ($port in $ports) {
    $command +=  (" " + $port)
}

$command

Invoke-Expression `
    -Command $command `
    -ErrorVariable errOut `
    -OutVariable stdOut

# Start-ThreadJob `
#     -ScriptBlock $scriptBlock `
#     -ArgumentList @($serverScriptPath) 


