/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_tajine: THREE.Mesh
    Mesh_tajine_1: THREE.Mesh
  }
  materials: {
    brown: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
  }
}

export function Tajine({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/tajine.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_tajine.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_tajine_1.geometry} material={materials.brownDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/tajine.glb')