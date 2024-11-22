import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';



export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:11000', // Your backend server URL
                changeOrigin: true, // Allows the proxy to change the origin of the request
                rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path to remove '/api'
            },
        },
    },
    build: {
        rollupOptions: {
            external: ['@fortawesome/free-solid-svg-icons']
        }
    }
});


