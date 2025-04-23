export const createPackageJson = (projectName, productName) => {
    return JSON.stringify({
        "name": projectName,
        "productName": productName ?? 'MyApp',
        "version": "0.0.0",
        "private": true,
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "node ./init.cjs && vite build && electron-builder",
            "preview": "vite preview"
        },
        "dependencies": {
            "vue": "^3.4.21"
        },
        "devDependencies": {
            "@vitejs/plugin-vue": "^5.0.4",
            "vite": "^5.1.6",
            "electron": "^30.0.1",
            "electron-builder": "^24.13.3",
            "vite-plugin-electron": "^0.28.6",
            "vite-plugin-electron-renderer": "^0.14.5"
        },
        "main": "dist-electron/main.js"
    }, null, 2)
}