import { CSSProperties, ReactNode } from 'react'

type Padding = 'sm' | 'md' | 'lg' | 'xl'
type Variant = 'default' | 'elevated' | 'outlined'

interface Card3DProps {
  children: ReactNode
  padding?: Padding
  variant?: Variant
  style?: CSSProperties
  onClick?: () => void
}

const paddingMap: Record<Padding, string> = {
  sm: '12px',
  md: '20px',
  lg: '28px',
  xl: '36px',
}

const variantStyles: Record<Variant, CSSProperties> = {
  default: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 0 #E5E7EB, 0 1px 3px rgba(0,0,0,0.1)',
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 0 #E5E7EB, 0 4px 6px rgba(0,0,0,0.1)',
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    boxShadow: 'none',
  },
}

export function Card3D({
  children,
  padding = 'md',
  variant = 'default',
  style,
  onClick,
}: Card3DProps) {
  const cardStyle: CSSProperties = {
    borderRadius: '16px',
    padding: paddingMap[padding],
    ...variantStyles[variant],
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    ...style,
  }

  return (
    <div style={cardStyle} onClick={onClick}>
      {children}
    </div>
  )
}
