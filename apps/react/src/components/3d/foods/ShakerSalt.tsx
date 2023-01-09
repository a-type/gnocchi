/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
// @ts-ignore
import { GLTF } from 'three-stdlib';
import { aqua, green, metal, white } from '../materials.js';
import { animated } from '@react-spring/three';

type GLTFResult = GLTF & {
	nodes: {
		Mesh_shakerSalt: THREE.Mesh;
		Mesh_shakerSalt_1: THREE.Mesh;
		Mesh_shakerSalt_2: THREE.Mesh;
	};
	materials: {
		greyDark: THREE.MeshStandardMaterial;
		brownDark: THREE.MeshStandardMaterial;
		_defaultMat: THREE.MeshStandardMaterial;
	};
};

export function ShakerSalt({ ...props }: JSX.IntrinsicElements['group']) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials } = useGLTF(
		'/models/kenney-foods/smoothed/shakerSalt.glb',
	) as GLTFResult;
	return (
		<animated.group ref={group} {...props} dispose={null}>
			<mesh
				castShadow
				geometry={nodes.Mesh_shakerSalt.geometry}
				material={metal}
			/>
			<mesh
				castShadow
				geometry={nodes.Mesh_shakerSalt_1.geometry}
				material={aqua}
			/>
			<mesh
				castShadow
				geometry={nodes.Mesh_shakerSalt_2.geometry}
				material={white}
			/>
		</animated.group>
	);
}

useGLTF.preload('/models/kenney-foods/smoothed/shakerSalt.glb');
