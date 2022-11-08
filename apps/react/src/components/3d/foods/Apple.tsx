/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_apple: THREE.Mesh
    Mesh_apple_1: THREE.Mesh
    Mesh_apple_2: THREE.Mesh
  }
  materials: {
    red: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
  }
}

export function Apple({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/apple.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_apple.geometry} material={materials.red} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_apple_1.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_apple_2.geometry} material={materials.green} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/apple.glb')
