"use client"

import * as React from "react"

type Point = { day: number; value: number }

export function VisitorsBarChart({ data }: { data: Point[] }) {
  const width = 900
  const height = 260
  const padding = { top: 24, right: 24, bottom: 36, left: 40 }

  const maxY = Math.max(10, ...data.map((d) => d.value))
  const yMaxRounded = Math.ceil(maxY / 10) * 10

  const xScale = (i: number) => {
    const innerW = width - padding.left - padding.right
    return padding.left + (innerW * i) / Math.max(1, data.length)
  }
  const barWidth = (width - padding.left - padding.right) / Math.max(1, data.length) - 4
  const yScale = (v: number) => {
    const innerH = height - padding.top - padding.bottom
    return padding.top + innerH - (innerH * v) / (yMaxRounded || 1)
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-[680px]">
        {/* Y grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = padding.top + (height - padding.top - padding.bottom) * t
          return <line key={idx} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
        })}

        {/* X axis labels (every 5th day) */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i) + barWidth / 2} y={height - 8} textAnchor="middle" fontSize={10} fill="#6b7280">
            {i % 5 === 0 ? d.day : ''}
          </text>
        ))}

        {/* Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const val = Math.round(yMaxRounded * (1 - t))
          const y = padding.top + (height - padding.top - padding.bottom) * t
          return (
            <text key={idx} x={8} y={y + 3} textAnchor="start" fontSize={10} fill="#6b7280">
              {val}
            </text>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = xScale(i)
          const y = yScale(d.value)
          const h = height - padding.bottom - y
          return <rect key={i} x={x} y={y} width={barWidth} height={h} rx={4} fill="#6366f1" />
        })}
      </svg>
    </div>
  )
}
