'use client'

import { CSSProperties } from 'react'
import { motion } from 'motion/react'

interface ProgressBarProps {
  value: number // 0-100
  height?: number
  showLabel?: boolean
  color?: string
}

export function ProgressBar({
  value,
  height = 12,
  showLabel = false,
  color = '#7C3AED',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const containerStyle: CSSProperties = {
    width: '100%',
    height: `${height}px`,
    backgroundColor: '#E5E7EB',
    borderRadius: `${height / 2}px`,
    overflow: 'hidden',
    position: 'relative',
  }

  const labelStyle: CSSProperties = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '10px',
    fontWeight: 600,
    color: clampedValue > 50 ? '#FFFFFF' : '#6B7280',
    zIndex: 1,
  }

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          height: '100%',
          backgroundColor: color,
          borderRadius: `${height / 2}px`,
        }}
      />
      {showLabel && <span style={labelStyle}>{Math.round(clampedValue)}%</span>}
    </div>
  )
}
