import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function initialTheme(): Theme {
    try {
        const saved = localStorage.getItem('ml-theme')
        if (saved === 'light' || saved === 'dark') return saved
    } catch {
        // storage unavailable, fall through
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(initialTheme)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        try {
            localStorage.setItem('ml-theme', theme)
        } catch {
            // ignore
        }
    }, [theme])

    const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    return { theme, toggle }
}