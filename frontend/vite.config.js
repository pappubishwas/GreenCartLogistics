// import { defineConfig, transformWithEsbuild } from 'vite';
// import react from '@vitejs/plugin-react';

// const jsFilter = /src\/.*\.js$/;

// export default defineConfig({
//   plugins: [
//     {
//       name: 'jsx-in-js-files',
//       async transform(code, id) {
//         if (!jsFilter.test(id)) return null;
//         return transformWithEsbuild(code, id, {
//           loader: 'jsx',
//           jsx: 'automatic', // enables React 17+ JSX transform
//         });
//       }
//     },
//     react(),
//   ],
//   optimizeDeps: {
//     force: true,
//     esbuildOptions: {
//       loader: {
//         '.js': 'jsx',  // Treat .js files as jsx
//       },
//     },
//   },
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {port:5173}
})
