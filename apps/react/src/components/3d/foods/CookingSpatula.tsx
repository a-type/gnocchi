/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_cookingSpatula: THREE.Mesh
    Mesh_cookingSpatula_1: THREE.Mesh
  }
  materials: {
    brown: THREE.MeshStandardMaterial
    white: THREE.MeshStandardMaterial
  }
}

export function CookingSpatula({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cookingSpatula.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cookingSpatula.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cookingSpatula_1.geometry} material={materials.white} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cookingSpatula.glb')
