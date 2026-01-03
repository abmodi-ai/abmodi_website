import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Ensure that assets are processed correctly
        rollupOptions: {
            input: {
                main: './index.html',
            },
        },
    },
});
