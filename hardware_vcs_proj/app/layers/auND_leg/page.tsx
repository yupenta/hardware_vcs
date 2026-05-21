'use client'

import { useEffect, useState } from 'react'
import yaml from 'js-yaml'
import { useParams } from 'next/navigation'

export default function LayerPage() {
  const { id } = useParams()
  const [layer, setLayer] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch('./public/sensor.yaml')
      const text = await res.text()
      const data = yaml.load(text) as any

      const found = data.layers.find((l: any) => l.id === id)
      setLayer(found)
    }

    load()
  }, [id])

  if (!layer) return <div>Loading...</div>

  return (
    <div style={{ padding: 40 }}>
      <h1>{layer.name}</h1>

      {/* 👉 THIS is your “properties/materials table” */}
      <h2>Properties</h2>

      <table>
        <tbody>
          <tr>
            <td>Material</td>
            <td>{layer.material}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{layer.status}</td>
          </tr>
          <tr>
            <td>Z</td>
            <td>{layer.z}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}