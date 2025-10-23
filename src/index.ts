#!/usr/bin/env node

import minimist from "minimist";

// Parse CLI arguments
const args = minimist(process.argv.slice(2), {
  string: ["resume"],
});

// Load managed settings and apply environment variables
import { loadManagedSettings, applyEnvironmentSettings } from "./utils.js";

const managedSettings = loadManagedSettings();
if (managedSettings) {
  applyEnvironmentSettings(managedSettings);
}

// stdout is used to send messages to the client
// we redirect everything else to stderr to make sure it doesn't interfere with ACP
console.log = console.error;
console.info = console.error;
console.warn = console.error;
console.debug = console.error;

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

import { runAcp as runAcp } from "./acp-agent.js";
runAcp({
  resumeSessionId: args.resume,
});

// Keep process alive
process.stdin.resume();
