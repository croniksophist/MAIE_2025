# Define the project root
$rootDir = "MAIE_Frontend"

# Define folder structure
$folders = @(
    "public",
    "src",
    "src/assets",
    "src/components",
    "src/hooks",
    "src/pages",
    "src/routes",
    "src/services",
    "src/store",
    "src/styles",
    "src/utils",
    "tests",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    ".github/workflows"
)

# Create directories
foreach ($folder in $folders) {
    $fullPath = "$rootDir/$folder"
    if (-Not (Test-Path -Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
    }
}

# Create files with initial content
$files = @{
    "public/index.html" = "<!DOCTYPE html><html><head><title>MAIE Frontend</title></head><body><div id='root'></div></body></html>"
    "public/manifest.json" = "{ 'name': 'MAIE App', 'short_name': 'MAIE' }"
    "src/App.tsx" = "export default function App() { return <h1>Hello, MAIE</h1>; }"
    "src/index.tsx" = "import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App'; ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);"
    "src/routes/index.tsx" = "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; export default function AppRoutes() { return (<Router><Routes></Routes></Router>); }"
    "src/store/index.ts" = "// State management setup (e.g., Redux/Zustand)"
    "src/services/api.ts" = "// API service logic"
    "src/utils/helpers.ts" = "// Utility functions"
    "src/styles/global.css" = "/* Global styles */"
    "tests/unit/example.test.tsx" = "import { render } from '@testing-library/react'; test('Example Test', () => { render(<div>Hello</div>); });"
    ".prettierrc" = "{ 'singleQuote': true, 'semi': false }"
    ".eslintrc" = "{ 'extends': 'react-app' }"
    "package.json" = "{ 'name': 'maie-frontend', 'version': '1.0.0', 'scripts': { 'start': 'vite' } }"
    "tsconfig.json" = "{ 'compilerOptions': { 'strict': true, 'jsx': 'react-jsx' } }"
    "README.md" = "# MAIE Frontend - Setup Guide"
}

# Create files with default content
foreach ($file in $files.Keys) {
    $filePath = "$rootDir/$file"
    if (-Not (Test-Path -Path $filePath)) {
        New-Item -Path $filePath -ItemType File -Force | Out-Null
        Set-Content -Path $filePath -Value $files[$file]
    }
}

Write-Host "Frontend project structure created successfully!"