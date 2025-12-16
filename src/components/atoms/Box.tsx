import { CSSProperties, ReactNode } from 'react'

type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Padding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface BoxProps {
  children?: ReactNode
  flex?: boolean
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: Gap
  padding?: Padding
  wrap?: boolean
  style?: CSSProperties
  className?: string
  onClick?: () => void
}

const gapMap: Record<Gap, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}

const paddingMap: Record<Padding, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
}

export function Box({
  children,
  flex = false,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'none',
  padding = 'none',
  wrap = false,
  style,
  className,
  onClick,
}: BoxProps) {
  const boxStyle: CSSProperties = {
    display: flex ? 'flex' : 'block',
    flexDirection: direction === 'col' ? 'column' : 'row',
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    gap: gapMap[gap],
    padding: paddingMap[padding],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  }

  return (
    <div style={boxStyle} className={className} onClick={onClick}>
      {children}
    </div>
  )
}
