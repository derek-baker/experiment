# USAGE: pwsh <SCRIPT_PATH>.ps1
param(
    # 
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

Remove-Module -Name "$PSScriptRoot/../Client" -Force -ErrorAction SilentlyContinue
Import-Module -Name "$PSScriptRoot/../Client" -Force

RunScenarioA -loadBalancerUrl 'http://localhost:8082'
