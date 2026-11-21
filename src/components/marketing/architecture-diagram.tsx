'use client'

import { useMemo, useState } from 'react'

type Node = { id: string; label: string; tier?: string | null; icon?: string | null }
type Edge = { from: string; to: string; label?: string | null }

const lanes = ['source', 'transform', 'store', 'serve', 'client'] as const

export function ArchitectureDiagram({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const [active, setActive] = useState(nodes[0]?.id || '')
  const layout = useMemo(() => {
    const grouped = lanes.map((tier) => nodes.filter((node) => (node.tier || 'transform') === tier))
    const positions = new Map<string, { x: number; y: number }>()
    grouped.forEach((column, columnIndex) => {
      column.forEach((node, rowIndex) => {
        const y = column.length === 1 ? 180 : 70 + (rowIndex * 220) / Math.max(column.length - 1, 1)
        positions.set(node.id, { x: 90 + columnIndex * 200, y })
      })
    })
    return positions
  }, [nodes])
  const selected = nodes.find((node) => node.id === active)
  const related = edges.filter((edge) => edge.from === active || edge.to === active)

  return (
    <div className="architecture-diagram">
      <svg viewBox="0 0 980 360" role="img" aria-label="Architecture diagram">
        {edges.map((edge, index) => {
          const from = layout.get(edge.from)
          const to = layout.get(edge.to)
          if (!from || !to) return null
          const hot = edge.from === active || edge.to === active
          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <line className={`architecture-edge ${hot ? 'is-hot' : ''}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
              {edge.label ? (
                <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle">
                  {edge.label}
                </text>
              ) : null}
            </g>
          )
        })}
        {nodes.map((node) => {
          const point = layout.get(node.id)
          if (!point) return null
          return (
            <g key={node.id} className={node.id === active ? 'is-active' : ''} transform={`translate(${point.x} ${point.y})`}>
              <rect x="-70" y="-28" width="140" height="56" rx="4" />
              <text textAnchor="middle" y="-4" className="architecture-tier">
                {node.tier || 'transform'}
              </text>
              <text textAnchor="middle" y="14">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="architecture-picker" role="group" aria-label="Diagram nodes">
        {nodes.map((node) => (
          <button key={node.id} type="button" className={node.id === active ? 'is-active' : ''} aria-pressed={node.id === active} onClick={() => setActive(node.id)}>
            <span className="mono-label">{node.tier || 'transform'}</span>
            {node.label}
          </button>
        ))}
      </div>
      {selected ? (
        <aside className="pipeline-detail">
          <span className="mono-label">{selected.tier || 'transform'}{selected.icon ? ` · ${selected.icon}` : ''}</span>
          <h3>{selected.label}</h3>
          {related.length ? (
            <ul>
              {related.map((edge, index) => (
                <li key={`${edge.from}-${edge.to}-${index}`}>
                  {edge.from} → {edge.to}
                  {edge.label ? ` · ${edge.label}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>This node has no connected edges yet.</p>
          )}
        </aside>
      ) : null}
    </div>
  )
}
