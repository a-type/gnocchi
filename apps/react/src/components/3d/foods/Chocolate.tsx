/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    chocolate: THREE.Mesh
  }
  materials: {
    brownDark: THREE.MeshStandardMaterial
  }
}

export function Chocolate({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/chocolate.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.chocolate.geometry} material={materials.brownDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/chocolate.glb')
