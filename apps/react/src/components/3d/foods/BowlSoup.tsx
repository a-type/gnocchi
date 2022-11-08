/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Mesh_bowlSoup: THREE.Mesh
    Mesh_bowlSoup_1: THREE.Mesh
    Mesh_bowlSoup_2: THREE.Mesh
    Mesh_bowlSoup_3: THREE.Mesh
    Mesh_bowlSoup_4: THREE.Mesh
  }
  materials: {
    _defaultMat: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
    brown: THREE.MeshStandardMaterial
    green: THREE.MeshStandardMaterial
    orange: THREE.MeshStandardMaterial
  }
}

export function BowlSoup({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/bowlSoup.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.93}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh_bowlSoup.geometry} material={materials._defaultMat} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_bowlSoup_1.geometry} material={materials.brownLight} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_bowlSoup_2.geometry} material={materials.brown} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_bowlSoup_3.geometry} material={materials.green} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_bowlSoup_4.geometry} material={materials.orange} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/bowlSoup.glb')
