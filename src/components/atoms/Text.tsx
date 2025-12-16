import { CSSProperties, ReactNode } from 'react'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'tiny'
type Weight = 'normal' | 'medium' | 'semibold' | 'bold' | 'black'
type Color = 'default' | 'muted' | 'primary' | 'success' | 'error' | 'warning' | 'white'

interface TextProps {
  children: ReactNode
  variant?: Variant
  weight?: Weight
  color?: Color
  align?: 'left' | 'center' | 'right'
  style?: CSSProperties
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
}

const variantStyles: Record<Variant, CSSProperties> = {
  h1: { fontSize: '36px', lineHeight: '1.2' },
  h2: { fontSize: '28px', lineHeight: '1.3' },
  h3: { fontSize: '22px', lineHeight: '1.4' },
  h4: { fontSize: '18px', lineHeight: '1.4' },
  body: { fontSize: '16px', lineHeight: '1.5' },
  small: { fontSize: '14px', lineHeight: '1.5' },
  tiny: { fontSize: '12px', lineHeight: '1.5' },
}

const weightMap: Record<Weight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
}

const colorMap: Record<Color, string> = {
  default: '#1F2937',
  muted: '#6B7280',
  primary: '#7C3AED',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
}

export function Text({
  children,
  variant = 'body',
  weight = 'normal',
  color = 'default',
  align = 'left',
  style,
  as = 'p',
}: TextProps) {
  const Component = as

  const textStyle: CSSProperties = {
    ...variantStyles[variant],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    margin: 0,
    ...style,
  }

  return <Component style={textStyle}>{children}</Component>
}
