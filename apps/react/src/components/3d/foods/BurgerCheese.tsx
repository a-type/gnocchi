/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    bunBottom: THREE.Mesh
    bunTop: THREE.Mesh
    cheese: THREE.Mesh
    patty: THREE.Mesh
  }
  materials: {
    brownLight: THREE.MeshStandardMaterial
    yellow: THREE.MeshStandardMaterial
    brownDark: THREE.MeshStandardMaterial
  }
}

export function BurgerCheese({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/kenney-foods/burgerCheese.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.bunBottom.geometry} material={nodes.bunBottom.material} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.bunTop.geometry}
        material={nodes.bunTop.material}
        position={[0, 0.1, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cheese.geometry}
        material={materials.yellow}
        position={[0, 0.06, 0]}
        scale={[2.79, 1, 1.43]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.patty.geometry}
        material={materials.brownDark}
        position={[0, 0.04, 0]}
        scale={[1, 1.14, 1]}
      />
    </group>
  )
}

useGLTF.preload('/models/kenney-foods/burgerCheese.glb')
