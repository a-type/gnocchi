/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_iceCreamScoop: THREE.Mesh
    Mesh_iceCreamScoop_1: THREE.Mesh
  }
  materials: {
    purpleLight: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
  }
}

export function IceCreamScoop({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/iceCreamScoop.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={[1, 1.19, 1]}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_iceCreamScoop.geometry} material={materials.purpleLight} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_iceCreamScoop_1.geometry} material={materials.brownDark} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/iceCreamScoop.glb')