// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//   },
// });


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: '/Full-stack-E-commerce-website/',
// })


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],

//   base: "/Full-stack-E-commerce-website-/",

//   server: {
//     port: 5173,
//   },
// });



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   base: "/Full-stack-E-commerce-website/",
//   server: {
//     port: 5173,
//   },
// });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],

//   base: process.env.NODE_ENV === "production"
//     ? "/Full-stack-E-commerce-website/"
//     : "/",

//   server: {
//     port: 5173,
//   },
// }); 


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Full-stack-E-commerce-website-/",
  server: {
    port: 5173,
  },
});