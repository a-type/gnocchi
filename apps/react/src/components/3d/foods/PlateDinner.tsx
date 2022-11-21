/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_plateDinner: THREE.Mesh
    Mesh_plateDinner_1: THREE.Mesh
    Mesh_plateDinner_2: THREE.Mesh
    Mesh_plateDinner_3: THREE.Mesh
    Mesh_plateDinner_4: THREE.Mesh
  }
  materials: {
    brownDark: THREE.MeshStandardMaterial
    _defaultMat: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function PlateDinner({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/plateDinner.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_plateDinner.geometry} material={materials.brownDark} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_plateDinner_1.geometry} material={materials._defaultMat} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_plateDinner_2.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_plateDinner_3.geometry} material={materials.green} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_plateDinner_4.geometry} material={materials.brownLight} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/plateDinner.glb')