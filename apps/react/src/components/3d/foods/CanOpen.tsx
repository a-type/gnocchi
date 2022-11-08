/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_canOpen: THREE.Mesh
    Mesh_canOpen_1: THREE.Mesh
    Mesh_canOpen_2: THREE.Mesh
    Mesh_canOpen_3: THREE.Mesh
  }
  materials: {
    greyLight: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
    greyDark: THREE.MeshStandardMaterial
  }
}

export function CanOpen({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/canOpen.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_canOpen.geometry} material={materials.greyLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_canOpen_1.geometry} material={materials.brownDark} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_canOpen_2.geometry} material={materials.green} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_canOpen_3.geometry} material={materials.greyDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/canOpen.glb')
