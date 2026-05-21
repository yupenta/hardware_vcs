'use client' //run on client side since thats where we want
//to do all the user interfacing and hovering and stuff

import { useEffect, useState } from 'react';
import yaml from 'js-yaml'
import { useParams, useRouter } from 'next/navigation'
//import Image from "next/image";

export default function HomePage() {
  //we declare the layers object and option of selection here to ref l8r
  const [layers, setLayers] = useState<any []>([]);
  const [sel, setSel] = useState<string | null>(null)
  //^ remember that its case matching with an initial val and function to update
  // layers is where the layers of the yaml file will be created and stored
  // selection of a layer is detected and stored in sel
  const { id } = useParams()
  const router = useRouter()
  // let the id be using the webpage name
  const onClick=(layerid : string) => {
      router.push(`/layers/${layerid}`)
  }
  //function to get the url of where the path points to
    useEffect(() => {
      async function load() {
        const f = await fetch('./sensor.yaml')
        const text = await f.text()
        //^ first fetches file then reads it
        const data = yaml.load(text) as any
        //^ converts to a TypeScript object
        const allLayers = Array.isArray(data?.layers) ? data.layers : []
        const visibleLayers = id
          ? allLayers.filter((layer: any) => layer.id === id)
          : allLayers
        setLayers(visibleLayers)
        //^ store an array so .map() works safely
      }
      load()
    }, [id]) // (function to call, run only once)
    return ( // the actual page
      <div style={{ padding: 40 }}>
      <h1>Shadows Forge — L0 Exploded View</h1>

      <div style={{ marginTop: 40 }}>
        {layers
          //.sort((a, b) => b.z - a.z)
          .map(layer => (
            <div
              key={layer.id}
              onClick={() => onClick(layer.id)}
              onMouseEnter={() => console.log('hover', layer.id)}
              style={{
                padding: 20,
                marginBottom: 12,
                border: '1px solid #333',
                cursor: 'pointer',
                background:
                  sel === layer.id ? '#1a1f24' : '#0a0d0f',
                color:
                  layer.status === 'dirty'
                    ? '#e24b4a'
                    : layer.status === 'stable'
                    ? '#5dcaa5'
                    : '#ccc'
              }}
            >
              <strong>{layer.name}</strong>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {layer.id}
              </div>
            </div>
          ))}
      </div>
    </div>

    )
}