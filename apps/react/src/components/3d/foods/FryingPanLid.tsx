/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
// @ts-ignore
import { GLTF } from 'three-stdlib';
import { glass, metal } from '../materials.js';

type GLTFResult = GLTF & {
	nodes: {
		Mesh_fryingPanLid: THREE.Mesh;
		Mesh_fryingPanLid_1: THREE.Mesh;
		Mesh_fryingPanLid_2: THREE.Mesh;
	};
	materials: {
		greyDark: THREE.MeshStandardMaterial;
		glass: THREE.MeshStandardMaterial;
		_defaultMat: THREE.MeshStandardMaterial;
	};
};

export function FryingPanLid({ ...props }: JSX.IntrinsicElements['group']) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials } = useGLTF(
		'/models/kenney-foods/smoothed/fryingPanLid.glb',
	) as GLTFResult;

	console.log(materials.glass);
	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_fryingPanLid.geometry}
				material={metal}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_fryingPanLid_1.geometry}
				material={metal}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Mesh_fryingPanLid_2.geometry}
				material={metal}
			/>
		</group>
	);
}

useGLTF.preload('/models/kenney-foods/smoothed/fryingPanLid.glb');
