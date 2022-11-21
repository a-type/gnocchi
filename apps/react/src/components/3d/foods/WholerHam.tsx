/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_wholerHam: THREE.Mesh
    Mesh_wholerHam_1: THREE.Mesh
  }
  materials: {
    brownDark: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function WholerHam({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/wholerHam.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.77}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_wholerHam.geometry} material={materials.brownDark} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_wholerHam_1.geometry} material={materials.brownLight} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/wholerHam.glb')