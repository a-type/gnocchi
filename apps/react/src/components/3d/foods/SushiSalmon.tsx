/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    sushiSalmon: THREE.Mesh
    Mesh_salmon: THREE.Mesh
    Mesh_salmon_1: THREE.Mesh
  }
  materials: {
    _defaultMat: THREE.MeshStandardMaterial
    orange: THREE.MeshStandardMaterial
    brownLight: THREE.MeshStandardMaterial
  }
}

export function SushiSalmon({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/sushiSalmon.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.sushiSalmon.geometry}
        material={materials._defaultMat}
        scale={[1, 0.59, 1]}>
        <group position={[0, 0.07, 0]} scale={[0.85, 1.69, 1.15]}>
          <mesh castShadow receiveShadow geometry={nodes.Mesh_salmon.geometry} material={materials.orange} />
          <mesh castShadow receiveShadow geometry={nodes.Mesh_salmon_1.geometry} material={materials.brownLight} />
        </group>
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/sushiSalmon.glb')