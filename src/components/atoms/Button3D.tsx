'use client'

import { CSSProperties, ReactNode, useState } from 'react'

type Variant = 'primary' | 'secondary' | 'success' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Button3DProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  disabled?: boolean
  onClick?: () => void
  style?: CSSProperties
}

const variantStyles: Record<Variant, { bg: string; shadow: string; text: string; hoverBg: string }> = {
  primary: {
    bg: '#7C3AED',
    shadow: '#5B21B6',
    text: '#FFFFFF',
    hoverBg: '#8B5CF6',
  },
  secondary: {
    bg: '#F3F4F6',
    shadow: '#D1D5DB',
    text: '#1F2937',
    hoverBg: '#E5E7EB',
  },
  success: {
    bg: '#10B981',
    shadow: '#047857',
    text: '#FFFFFF',
    hoverBg: '#34D399',
  },
  ghost: {
    bg: 'transparent',
    shadow: 'transparent',
    text: '#7C3AED',
    hoverBg: '#F3F4F6',
  },
}

const sizeStyles: Record<Size, { padding: string; fontSize: string; borderRadius: string }> = {
  sm: { padding: '8px 16px', fontSize: '14px', borderRadius: '8px' },
  md: { padding: '12px 24px', fontSize: '16px', borderRadius: '12px' },
  lg: { padding: '16px 32px', fontSize: '18px', borderRadius: '16px' },
}

export function Button3D({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  style,
}: Button3DProps) {
  const [isPressed, setIsPressed] = useState(false)

  const colors = variantStyles[variant]
  const sizes = sizeStyles[size]

  const buttonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: sizes.padding,
    fontSize: sizes.fontSize,
    fontWeight: 600,
    color: colors.text,
    backgroundColor: colors.bg,
    border: 'none',
    borderRadius: sizes.borderRadius,
    boxShadow: isPressed ? 'none' : `0 4px 0 ${colors.shadow}`,
    transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
    transition: 'all 100ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  }

  return (
    <button
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </button>
  )
}
