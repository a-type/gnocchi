/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    bottleMusterd: THREE.Mesh
  }
  materials: {
    yellow: THREE.MeshStandardMaterial
  }
}

export function BottleMusterd({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/bottleMusterd.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.bottleMusterd.geometry} material={materials.yellow} scale={0.21} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/bottleMusterd.glb')
