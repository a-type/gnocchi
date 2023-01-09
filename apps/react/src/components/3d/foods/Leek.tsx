/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
// @ts-ignore
import { GLTF } from 'three-stdlib';
import { darkGreen, green, white } from '../materials.js';
import { animated } from '@react-spring/three';

type GLTFResult = GLTF & {
	nodes: {
		Mesh_leek: THREE.Mesh;
		Mesh_leek_1: THREE.Mesh;
		Mesh_leek_2: THREE.Mesh;
	};
	materials: {
		green: THREE.MeshStandardMaterial;
		_defaultMat: THREE.MeshStandardMaterial;
		greenDark: THREE.MeshStandardMaterial;
	};
};

export function Leek({ ...props }: JSX.IntrinsicElements['group']) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials } = useGLTF(
		'/models/kenney-foods/leek.glb',
	) as GLTFResult;
	return (
		<animated.group ref={group} {...props} dispose={null}>
			<mesh castShadow geometry={nodes.Mesh_leek.geometry} material={green} />
			<mesh castShadow geometry={nodes.Mesh_leek_1.geometry} material={white} />
			<mesh
				castShadow
				geometry={nodes.Mesh_leek_2.geometry}
				material={darkGreen}
			/>
		</animated.group>
	);
}

useGLTF.preload('/models/kenney-foods/leek.glb');
