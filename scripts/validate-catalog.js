#!/usr/bin/env node
import { validateCatalog } from "../src/catalog.js";

validateCatalog()
  .then(({ errors, warnings }) => {
    for (const warning of warnings) {
      console.warn(`warning: ${warning}`);
    }
    if (errors.length > 0) {
      for (const error of errors) {
        console.error(`error: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log("Catalog validation passed.");
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
