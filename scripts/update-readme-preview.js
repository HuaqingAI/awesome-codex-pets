#!/usr/bin/env node
import { updateAllReadmeGalleries } from "../src/readme-gallery.js";

updateAllReadmeGalleries()
  .then((results) => {
    for (const result of results) {
      console.log(`Updated ${result.readmePath} (${result.petCount} pet(s)).`);
    }
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
