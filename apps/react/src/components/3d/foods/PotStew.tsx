/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_potStew: THREE.Mesh
    Mesh_potStew_1: THREE.Mesh
    Mesh_potStew_2: THREE.Mesh
    Mesh_potStew_3: THREE.Mesh
    Mesh_potStew_4: THREE.Mesh
    Mesh_potStew_5: THREE.Mesh
  }
  materials: {
    greyDark: THREE.MeshStandardMaterial
    _defaultMat: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
    yellow: THREE.MeshStandardMaterial
    orange: THREE.MeshStandardMaterial
  }
}

export function PotStew({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/potStew.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew.geometry} material={materials.greyDark} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew_1.geometry} material={materials._defaultMat} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew_2.geometry} material={materials.brown} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew_3.geometry} material={materials.brownDark} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew_4.geometry} material={materials.yellow} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_potStew_5.geometry} material={materials.orange} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/potStew.glb')
