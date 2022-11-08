/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    cuttingBoardJapanese: THREE.Mesh
  }
  materials: {
    brownLight: THREE.MeshStandardMaterial
  }
}

export function CuttingBoardJapanese({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cuttingBoardJapanese.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.cuttingBoardJapanese.geometry} material={materials.brownLight} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cuttingBoardJapanese.glb')
