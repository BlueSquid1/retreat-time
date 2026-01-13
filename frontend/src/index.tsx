import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

// Handle dark and light themes
let preferDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (preferDarkTheme) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
}

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);