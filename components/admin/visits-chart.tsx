"use client"

import * as React from "react"

type D = { month: string; visits: number; uniquePaths: number }

function linePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ""
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
}

export function VisitsChart({ data }: { data: D[] }) {
  const width = 800
  const height = 260
  const padding = { top: 24, right: 24, bottom: 36, left: 36 }

  const xCount = data.length
  const maxY = Math.max(10, ...data.map((d) => Math.max(d.visits, d.uniquePaths)))
  const yMaxRounded = Math.ceil(maxY / 10) * 10

  const xScale = (i: number) => {
    const innerW = width - padding.left - padding.right
    return padding.left + (innerW * i) / Math.max(1, xCount - 1)
  }
  const yScale = (v: number) => {
    const innerH = height - padding.top - padding.bottom
    return padding.top + innerH - (innerH * v) / (yMaxRounded || 1)
  }

  const visitsPts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.visits) }))
  const uniquePts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.uniquePaths) }))

  const months = data.map((d) => d.month)

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-[640px]">
        {/* Y grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = padding.top + (height - padding.top - padding.bottom) * t
          return <line key={idx} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
        })}

        {/* X axis labels */}
        {months.map((m, i) => (
          <text key={i} x={xScale(i)} y={height - 8} textAnchor="middle" fontSize={10} fill="#6b7280">
            {m}
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

        {/* Lines */}
        <path d={linePath(visitsPts)} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <path d={linePath(uniquePts)} fill="none" stroke="#8b5cf6" strokeWidth={2} />

        {/* Dots */}
        {visitsPts.map((p, i) => (
          <circle key={`v${i}`} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />
        ))}
        {uniquePts.map((p, i) => (
          <circle key={`u${i}`} cx={p.x} cy={p.y} r={3} fill="#8b5cf6" />
        ))}

        {/* Legend */}
        <g>
          <rect x={width - 170} y={10} width={150} height={24} rx={6} fill="#ffffff" stroke="#e5e7eb" />
          <circle cx={width - 155} cy={22} r={4} fill="#3b82f6" />
          <text x={width - 145} y={25} fontSize={11} fill="#374151">Visits</text>
          <circle cx={width - 95} cy={22} r={4} fill="#8b5cf6" />
          <text x={width - 85} y={25} fontSize={11} fill="#374151">Unique</text>
        </g>
      </svg>
    </div>
  )
}
