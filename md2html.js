#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("❌ Please provide a markdown file.");
  console.error("Usage: npm run md2html target.md");
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error("❌ File not found:", inputFile);
  process.exit(1);
}

const md = fs.readFileSync(inputFile, "utf8");

function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inList = false;

  for (let line of lines) {
    line = line.trim();

    if (line === "---") {
      html += `<div class="page-divider"></div>\n`;
      continue;
    }

    if (line.startsWith("## ")) {
      html += `<h2>${line.slice(3)}</h2>\n`;
      continue;
    }

    if (line.startsWith("# ")) {
      html += `<h1>${line.slice(2)}</h1>\n`;
      continue;
    }

    if (line.startsWith(">")) {
      html += `<blockquote>${line.slice(1).trim()}</blockquote>\n`;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        html += "<ul>\n";
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>\n`;
      continue;
    } else if (inList) {
      html += "</ul>\n";
      inList = false;
    }

    // bold & italics
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");

    if (line !== "") {
      html += `<p>${line}</p>\n`;
    }
  }

  if (inList) html += "</ul>\n";

  html += `<div class="page-divider content-end"></div>`;
  return html;
}

const htmlOutput = mdToHtml(md);

const outputFile = path.join(
  path.dirname(inputFile),
  path.basename(inputFile, ".md") + ".html"
);

fs.writeFileSync(outputFile, htmlOutput, "utf8");

console.log("✅ Converted:", inputFile, "→", outputFile);
