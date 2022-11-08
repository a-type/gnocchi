/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_cookingKnife: THREE.Mesh
    Mesh_cookingKnife_1: THREE.Mesh
    Mesh_cookingKnife_2: THREE.Mesh
  }
  materials: {
    white: THREE.MeshStandardMaterial
    greyLight: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
  }
}

export function CookingKnife({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cookingKnife.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cookingKnife.geometry} material={materials.white} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cookingKnife_1.geometry} material={materials.greyLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cookingKnife_2.geometry} material={materials.brownDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cookingKnife.glb')
