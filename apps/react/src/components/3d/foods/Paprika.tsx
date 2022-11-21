/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_paprika: THREE.Mesh
    Mesh_paprika_1: THREE.Mesh
  }
  materials: {
    red: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
  }
}

export function Paprika({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/paprika.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_paprika.geometry} material={materials.red} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_paprika_1.geometry} material={materials.green} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/paprika.glb')