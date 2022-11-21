/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_cocktail: THREE.Mesh
    Mesh_cocktail_1: THREE.Mesh
    Mesh_cocktail_2: THREE.Mesh
    Mesh_lemon: THREE.Mesh
    Mesh_lemon_1: THREE.Mesh
    straw: THREE.Mesh
  }
  materials: {
    _defaultMat: THREE.MeshStandardMaterial
    greyLight: THREE.MeshStandardMaterial
    red: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
    yellow: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
  }
}

export function Cocktail({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/cocktail.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cocktail.geometry} material={materials._defaultMat} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cocktail_1.geometry} material={materials.greyLight} />
      <mesh castShadow receiveShadow geometry={nodes.Mesh_cocktail_2.geometry} material={materials.red} />
      <group position={[0, 0.41, 0.13]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_lemon.geometry} material={materials.brownLight} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_lemon_1.geometry} material={materials.yellow} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.straw.geometry}
        material={materials.green}
        position={[-0.01, 0.35, -0.04]}
        rotation={[-0.26, 0, 0]}
        scale={[0.65, 0.88, 0.65]}
      />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/cocktail.glb')