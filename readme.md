# Onboarding Automation

These sets of scripts are used to easily configure machines when working in a new environment. They use the package managers Brew and Chocolately for Mac and Windows respectively. The idea is to make a generic onboarding script that you should only need to change the `json` files in the input folder.

## Running the script
### Windows
1. Go to the windows folder and create a file called `packages.config`.
2. The `packages.config` file will be used to list the software and any configuration needed
A sample for the software section can be found on [Chocolatelys site](https://docs.chocolatey.org/en-us/choco/commands/install#packages.config).
3. Run `./Main.ps1` in an elevated PowerShell terminal.
### Mac
1. Go to the mac folder and create a file called `configuration.json`
2. List any software you want to install based on it's Brew configuration in `softwareToInstall` key and any other configuration needed.
3. Run `.\main.zsh` from a terminal

If you receive a a permission error, you will need to change permissions on the `main.sh` using `chmod`

## Sample Mac File - configuration.json

```json
{
  "softwareToInstall" : [
    {
      "name": "mysql",
      "version": null
    },
    {
      "name": "steam",
      "version": 6
    }
  ],
  "preCommandsToRun": ["whoami", "ls"],
  "postCommandsToRun": ["whoami"],
  "gitRepos" : ["https://github.com/flutter/flutter.git", "https://github.com/getify/You-Dont-Know-JS"],
  "gitRepoPath" : "c:\\users\\joshu\\desktop"
}
```
## Sample Windows File - packages.config

```xml
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="steam-client" />
  <package id="googlechrome" />
  <package id="sublimetext3" />
  <precommandstorun>
    <command>whoami</command>
    <command>Get-ChildItem</command>
  </precommandstorun>
  <postcommandstorun>
   <command>ls</command>
  </postcommandstorun>
  <gitrepos>
    <repopath>c:\users\joshu\desktop\</repopath>
    <repo>https://github.com/flutter/flutter.git</repo>
    <repo>https://github.com/getify/You-Dont-Know-JS</repo>
  </gitrepos>
</packages>
```