/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_cherries: THREE.Mesh
    Mesh_cherries_1: THREE.Mesh
    Mesh_cherries_2: THREE.Mesh
  }
  materials: {
    green: THREE.MeshStandardMaterial
    red: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
  }
}

export function Cherries({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cherries.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cherries.geometry} material={materials.green} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cherries_1.geometry} material={materials.red} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cherries_2.geometry} material={materials.brown} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cherries.glb')