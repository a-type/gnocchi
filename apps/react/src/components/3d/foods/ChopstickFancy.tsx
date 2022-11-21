/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_chopstickFancy: THREE.Mesh
    Mesh_chopstickFancy_1: THREE.Mesh
    Mesh_chopstickFancy_2: THREE.Mesh
  }
  materials: {
    brown: THREE.MeshStandardMaterial
    red: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function ChopstickFancy({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/chopstickFancy.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_chopstickFancy.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_chopstickFancy_1.geometry} material={materials.red} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_chopstickFancy_2.geometry} material={materials.brownLight} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/chopstickFancy.glb')