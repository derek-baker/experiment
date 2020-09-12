# USAGE: pwsh <SCRIPT_PATH>.ps1
param(
    [string] $loadBalancerUrl = 'http://localhost:8080'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

Remove-Module -Name "$PSScriptRoot/../Client" -Force -ErrorAction SilentlyContinue
Import-Module -Name "$PSScriptRoot/../Client" -Force

# Scenario A
# RunScenario -loadBalancerUrl $loadBalancerUrl

# Scenario C
$priorityGenerator = { $priority = 1..10 | Get-Random; return $priority } 
RunScenario -loadBalancerUrl $loadBalancerUrl -priority $priorityGenerator
