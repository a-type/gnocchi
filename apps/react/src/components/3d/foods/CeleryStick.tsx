/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_celeryStick: THREE.Mesh
    Mesh_celeryStick_1: THREE.Mesh
  }
  materials: {
    green: THREE.MeshStandardMaterial
    greenDark: THREE.MeshStandardMaterial
  }
}

export function CeleryStick({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/celeryStick.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_celeryStick.geometry} material={materials.green} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_celeryStick_1.geometry} material={materials.greenDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/celeryStick.glb')
