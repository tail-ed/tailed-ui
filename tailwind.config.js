const { flowbite } = require("./tailwind.flowbite.config.js");
const { shadcn } = require("./tailwind.shadcn.config.js");
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...flowbite,
  ...shadcn,
};
