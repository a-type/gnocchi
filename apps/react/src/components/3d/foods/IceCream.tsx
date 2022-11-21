/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_iceCream: THREE.Mesh
    Mesh_iceCream_1: THREE.Mesh
  }
  materials: {
    purpleLight: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function IceCream({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/iceCream.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_iceCream.geometry} material={materials.purpleLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_iceCream_1.geometry} material={materials.brownLight} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/iceCream.glb')