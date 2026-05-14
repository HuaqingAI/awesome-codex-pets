#!/usr/bin/env node
import { updateReadmeGallery } from "../src/readme-gallery.js";

updateReadmeGallery()
  .then((result) => {
    console.log(`Updated ${result.readmePath} (${result.petCount} pet(s)).`);
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
