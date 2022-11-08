/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    turkey: THREE.Mesh
    Mesh_leg: THREE.Mesh
    Mesh_leg_1: THREE.Mesh
    Mesh_leg_2: THREE.Mesh
    Mesh_leg_3: THREE.Mesh
  }
  materials: {
    brownDark: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function Turkey({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/turkey.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.turkey.geometry} material={nodes.turkey.material}>
        <group position={[-0.14, 0, -0.19]} rotation={[0, 0.26, 0]} scale={1.3}>
          <mesh castShadow receiveShadow geometry={nodes.Mesh_leg.geometry} material={nodes.Mesh_leg.material} />
          <mesh castShadow receiveShadow geometry={nodes.Mesh_leg_1.geometry} material={nodes.Mesh_leg_1.material} />
        </group>
        <group position={[-0.14, 0, 0.19]} rotation={[0, -0.26, 0]} scale={1.3}>
          <mesh castShadow receiveShadow geometry={nodes.Mesh_leg_2.geometry} material={nodes.Mesh_leg_2.material} />
          <mesh castShadow receiveShadow geometry={nodes.Mesh_leg_3.geometry} material={nodes.Mesh_leg_3.material} />
        </group>
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/turkey.glb')
