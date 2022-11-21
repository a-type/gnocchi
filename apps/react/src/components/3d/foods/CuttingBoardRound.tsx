/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_cuttingBoardRound: THREE.Mesh
    Mesh_cuttingBoardRound_1: THREE.Mesh
  }
  materials: {
    brownLight: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
  }
}

export function CuttingBoardRound({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cuttingBoardRound.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cuttingBoardRound.geometry} material={materials.brownLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cuttingBoardRound_1.geometry} material={materials.brown} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cuttingBoardRound.glb')