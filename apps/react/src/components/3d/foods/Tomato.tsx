/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { green, red } from "../materials";
import { animated } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_tomato: THREE.Mesh;
    Mesh_tomato_1: THREE.Mesh;
  };
  materials: {
    red: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
  };
};

export function Tomato({ ...props }: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(
    "/models/kenney-foods/smoothed/tomato.glb"
  ) as GLTFResult;
  return (
    <animated.group ref={group} {...props} dispose={null}>
      <mesh castShadow geometry={nodes.Mesh_tomato.geometry} material={red} />
      <mesh
        castShadow
        geometry={nodes.Mesh_tomato_1.geometry}
        material={green}
      />
    </animated.group>
  );
}

useGLTF.preload("/models/kenney-foods/smoothed/tomato.glb");