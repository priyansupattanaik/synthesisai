"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use a ref to store the scene context so we can clean it up
  const sceneContext = useRef<{
    renderer: THREE.WebGLRenderer | null
    animationId: number | null
    scene: THREE.Scene | null
    camera: THREE.Camera | null
    geometry: THREE.PlaneGeometry | null
    material: THREE.ShaderMaterial | null
  }>({
    renderer: null,
    animationId: null,
    scene: null,
    camera: null,
    geometry: null,
    material: null
  })

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js
    const container = containerRef.current
    
    // Clear any existing content
    container.innerHTML = ""

    // Initialize camera
    const camera = new THREE.Camera()
    camera.position.z = 1

    // Initialize scene
    const scene = new THREE.Scene()

    // Create geometry - Use PlaneGeometry as PlaneBufferGeometry is deprecated/removed in newer Three.js versions
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Define uniforms
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
        
      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }
      
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);       
          
        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));        
          }
        }

        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true }) // alpha: true for potential transparency
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Store references
    sceneContext.current = {
      renderer,
      animationId: null,
      scene,
      camera,
      geometry,
      material
    }

    // Handle resize
    const onWindowResize = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      sceneContext.current.animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)
      
      if (sceneContext.current.animationId) {
        cancelAnimationFrame(sceneContext.current.animationId)
      }
      
      if (sceneContext.current.renderer) {
        sceneContext.current.renderer.dispose()
        const domElement = sceneContext.current.renderer.domElement
        if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement)
        }
      }

      if (sceneContext.current.geometry) {
        sceneContext.current.geometry.dispose()
      }

      if (sceneContext.current.material) {
        sceneContext.current.material.dispose()
      }
    }
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none" 
      style={{ opacity: 0.4 }} // Lower opacity so it doesn't overwhelm the content
    />
  )
}
