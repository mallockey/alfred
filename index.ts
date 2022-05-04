import {
  SoftwareReportItem,
  SoftwareReportList,
  SoftwareToInstall,
} from "./types";

import softwareToInstall from "./inputFiles/softwareList.json";
import commandsToRun from "./inputFiles/commandsToRun.json";

import { checkIfInstalled, invokeCommand } from "./utils";

// Any commands to run prior to software installation
commandsToRun.preCommandsToRun.forEach((command) => {
  invokeCommand(command);
});

// Generate system list of installed software
console.log("Generating System Installed Software Report...");

const softwareInstalledReportOutput = invokeCommand(
  "system_profiler SPApplicationsDataType -json",
  true
);

let softwareInstalledList: SoftwareReportItem[];
if (typeof softwareInstalledReportOutput === "string") {
  const softwareInstalledReport: SoftwareReportList = JSON.parse(
    softwareInstalledReportOutput
  );
  softwareInstalledList = softwareInstalledReport.SPApplicationsDataType;
}

// Generate list of software installed by Brew
const softwareBrewReport = invokeCommand("brew list", true) as string;

console.log("Generating Brew Installed Software Report...");

for (const software of softwareToInstall as SoftwareToInstall[]) {
  if (checkIfInstalled(software, softwareInstalledList, softwareBrewReport)) {
    console.log(`${software.reportDisplayName} is already installed`);
    continue;
  }

  software?.preInstallCommands?.forEach((preInstallCommand) => {
    invokeCommand(preInstallCommand);
  });

  console.log(`Installing ${software.reportDisplayName} `);
  if (software.version) {
    invokeCommand(`brew install ${software.brewName}@${software.version}`);
  } else {
    invokeCommand(`brew install ${software.brewName}`);
  }

  software?.postInstallCommands?.forEach((postInstallCommand) => {
    invokeCommand(postInstallCommand);
  });

  // Reload to make sure we have access to any new environment variables
  invokeCommand("zsh $HOME/.zshrc");

  const checkInstallCommand = software.isCask
    ? `brew ls --cask --versions ${software.brewName}`
    : `brew ls --versions ${software.brewName}`;

  const softwareWasInstalled = invokeCommand(checkInstallCommand, true);

  if (typeof softwareWasInstalled === "string") {
    if (!softwareWasInstalled) {
      console.log(`${software.reportDisplayName} was not installed`);
    } else {
      console.log(`Successfully installed ${software.reportDisplayName}`);
    }
  }
}

// Any commands to run after software installation
commandsToRun.postCommandsToRun.forEach((command) => {
  invokeCommand(command);
});
