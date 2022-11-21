/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    cupSaucer: THREE.Mesh
  }
  materials: {
    _defaultMat: THREE.MeshStandardMaterial
  }
}

export function CupSaucer({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cupSaucer.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.cupSaucer.geometry} material={materials._defaultMat} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cupSaucer.glb')