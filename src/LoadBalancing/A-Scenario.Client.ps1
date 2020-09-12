Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop";

Remove-Module -Name "$PSScriptRoot/../Client" -Force -ErrorAction SilentlyContinue
Import-Module -Name "$PSScriptRoot/../Client" -Force

# node ./A-Scenario.Server.js
RunScenarioA -serverUrl 'http://localhost:8081'
