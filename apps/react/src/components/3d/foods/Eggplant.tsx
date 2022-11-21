/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_eggplant: THREE.Mesh
    Mesh_eggplant_1: THREE.Mesh
    Mesh_eggplant_2: THREE.Mesh
  }
  materials: {
    purple: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
    _defaultMat: THREE.MeshStandardMaterial
  }
}

export function Eggplant({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/eggplant.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_eggplant.geometry} material={materials.purple} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_eggplant_1.geometry} material={materials.green} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_eggplant_2.geometry} material={materials._defaultMat} />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/eggplant.glb')