/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_donutSprinkles: THREE.Mesh
    Mesh_donutSprinkles_1: THREE.Mesh
    Mesh_donutSprinkles_2: THREE.Mesh
    Mesh_donutSprinkles_3: THREE.Mesh
    Mesh_donutSprinkles_4: THREE.Mesh
  }
  materials: {
    brownLight: THREE.MeshStandardMaterial
    purpleLight: THREE.MeshStandardMaterial
    orange: THREE.MeshStandardMaterial
    yellow: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
  }
}

export function DonutSprinkles({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/donutSprinkles.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_donutSprinkles.geometry} material={materials.brownLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_donutSprinkles_1.geometry} material={materials.purpleLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_donutSprinkles_2.geometry} material={materials.orange} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_donutSprinkles_3.geometry} material={materials.yellow} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_donutSprinkles_4.geometry} material={materials.green} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/donutSprinkles.glb')