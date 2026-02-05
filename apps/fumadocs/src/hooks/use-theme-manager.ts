"use client"

import React from 'react'
import { useTheme } from '@/hooks/use-theme'
import { baseColors } from '@/config/theme-customizer-constants'
import { colorThemes } from '@/config/theme-data'
import type { ThemePreset, ImportedTheme } from '@/types/theme-customizer'

export function useThemeManager() {
  const { theme, setTheme } = useTheme()
  const [brandColorsValues, setBrandColorsValues] = React.useState<Record<string, string>>({})

  const isDarkMode = React.useMemo(() => {
    if (theme === "dark") return true
    if (theme === "light") return false
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  }, [theme])

  const resetTheme = React.useCallback(() => {
    const root = document.documentElement
    const allPossibleVars = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
      'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input',
      'ring', 'radius',
      
      'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
      
      'sidebar', 'sidebar-background', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
      
      'font-sans', 'font-serif', 'font-mono',
      
      'shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
      
      'spacing', 'tracking-normal',
      
      'card-header', 'card-content', 'card-footer', 'muted-background', 'accent-background',
      'destructive-background', 'warning', 'warning-foreground', 'success', 'success-foreground',
      'info', 'info-foreground'
    ]
    
    allPossibleVars.forEach(varName => {
      root.style.removeProperty(`--${varName}`)
    })
    
    const inlineStyles = root.style
    for (let i = inlineStyles.length - 1; i >= 0; i--) {
      const property = inlineStyles[i]
      if (property.startsWith('--')) {
        root.style.removeProperty(property)
      }
    }
  }, [])

  const updateBrandColorsFromTheme = React.useCallback((styles: Record<string, string>) => {
    const newValues: Record<string, string> = {}
    baseColors.forEach(color => {
      const cssVar = color.cssVar.replace('--', '')
      if (styles[cssVar]) {
        newValues[color.cssVar] = styles[cssVar]
      }
    })
    setBrandColorsValues(newValues)
  }, [])

  const applyTheme = React.useCallback((themeValue: string, darkMode: boolean) => {
    const theme = colorThemes.find(t => t.value === themeValue)
    if (!theme) return

    resetTheme()
    const styles = darkMode ? theme.preset.styles.dark : theme.preset.styles.light
    const root = document.documentElement

    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    updateBrandColorsFromTheme(styles)
  }, [resetTheme, updateBrandColorsFromTheme])

  const applyTweakcnTheme = React.useCallback((themePreset: ThemePreset, darkMode: boolean) => {
    resetTheme()
    const styles = darkMode ? themePreset.styles.dark : themePreset.styles.light
    const root = document.documentElement

    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    updateBrandColorsFromTheme(styles)
  }, [resetTheme, updateBrandColorsFromTheme])

  const applyImportedTheme = React.useCallback((themeData: ImportedTheme, darkMode: boolean) => {
    const root = document.documentElement
    const themeVars = darkMode ? themeData.dark : themeData.light
    
    Object.entries(themeVars).forEach(([variable, value]) => {
      root.style.setProperty(`--${variable}`, value)
    })
    
    const newBrandColors: Record<string, string> = {}
    baseColors.forEach(color => {
      const varName = color.cssVar.replace('--', '')
      if (themeVars[varName]) {
        newBrandColors[color.cssVar] = themeVars[varName]
      }
    })
    setBrandColorsValues(newBrandColors)
  }, [])

  const applyRadius = (radius: string) => {
    document.documentElement.style.setProperty('--radius', radius)
  }

  const handleColorChange = (cssVar: string, value: string) => {
    document.documentElement.style.setProperty(cssVar, value)
  }

  return {
    theme,
    setTheme,
    isDarkMode,
    brandColorsValues,
    setBrandColorsValues,
    resetTheme,
    applyTheme,
    applyTweakcnTheme,
    applyImportedTheme,
    applyRadius,
    handleColorChange,
    updateBrandColorsFromTheme
  }
}
