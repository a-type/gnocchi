/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_wineRed: THREE.Mesh
    Mesh_wineRed_1: THREE.Mesh
    Mesh_wineRed_2: THREE.Mesh
    Mesh_wineRed_3: THREE.Mesh
  }
  materials: {
    brownDarkest: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
    red: THREE.MeshStandardMaterial
  }
}

export function WineRed({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/wineRed.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_wineRed.geometry} material={materials.brownDarkest} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_wineRed_1.geometry} material={materials.brownLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_wineRed_2.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_wineRed_3.geometry} material={materials.red} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/wineRed.glb')