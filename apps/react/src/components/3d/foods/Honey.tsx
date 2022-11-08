/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_honey: THREE.Mesh
    Mesh_honey_1: THREE.Mesh
    Mesh_honey_2: THREE.Mesh
  }
  materials: {
    brownLight: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
    yellow: THREE.MeshStandardMaterial
  }
}

export function Honey({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/honey.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_honey.geometry} material={materials.brownLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_honey_1.geometry} material={materials.brownDark} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_honey_2.geometry} material={materials.yellow} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/honey.glb')
