import React, { Suspense, useEffect, lazy } from 'react'

// Lazy-load the heavy Panchaangam component (Three.js + SwissEph WASM)
const Panchaangam = lazy(() => import('./Panchaangam'))

function LoadingFallback() {
  return null // The HTML loading screen is already visible
}

function App() {
  // Dismiss the HTML loading screen once React has mounted
  useEffect(() => {
    const loader = document.getElementById('loading-screen')
    if (loader) {
      // Small delay to let the first paint settle
      const timer = setTimeout(() => {
        loader.classList.add('fade-out')
        setTimeout(() => loader.remove(), 600)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Panchaangam />
    </Suspense>
  )
}

export default App
