/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    utensilFork: THREE.Mesh
  }
  materials: {
    white: THREE.MeshStandardMaterial
  }
}

export function UtensilFork({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/utensilFork.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.utensilFork.geometry} material={materials.white} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/utensilFork.glb')
