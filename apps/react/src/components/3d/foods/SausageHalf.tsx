/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_sausageHalf: THREE.Mesh
    Mesh_sausageHalf_1: THREE.Mesh
    Mesh_sausageHalf_2: THREE.Mesh
  }
  materials: {
    white: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
  }
}

export function SausageHalf({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/sausageHalf.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_sausageHalf.geometry} material={materials.white} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_sausageHalf_1.geometry} material={materials.brownLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_sausageHalf_2.geometry} material={materials.brownDark} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/sausageHalf.glb')
