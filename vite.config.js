import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Cho phép mở giao diện kiểm thử trên điện thoại cùng mạng LAN
  },
});
