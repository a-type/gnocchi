import { animated } from '@react-spring/three';
import {
	Bounds,
	Float,
	PerformanceMonitor,
	PerspectiveCamera,
	Plane,
	SoftShadows,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
	// @ts-ignore
	EffectComposer,
	// @ts-ignore
	Outline,
	// @ts-ignore
	Select,
	// @ts-ignore
	Selection,
} from '@react-three/postprocessing';
import { Suspense, useState } from 'react';
import { CookingSpoon } from './foods/CookingSpoon.jsx';
import { FryingPan } from './foods/FryingPan.jsx';
import { FryingPanLid } from './foods/FryingPanLid.jsx';
import { Garlic } from './foods/Garlic.jsx';
import { Leek } from './foods/Leek.jsx';
import { OnionHalf } from './foods/OnionHalf.jsx';
import { PepperMill } from './foods/PepperMill.jsx';
import { ShakerSalt } from './foods/ShakerSalt.jsx';
import { Tomato } from './foods/Tomato.jsx';

export function Scene(props: { className?: string }) {
	const [dpr, setDpr] = useState(1.5);
	return (
		<Canvas linear dpr={dpr} shadows className="Scene" {...props}>
			<Suspense fallback={null}>
				<PerformanceMonitor
					onDecline={() => setDpr(1)}
					onIncline={() => setDpr(2)}
					flipflops={3}
					onFallback={() => setDpr(1)}
				/>
				<Selection>
					{/* <fog attach="fog" args={['white', 0, 40]} /> */}
					<ambientLight color="white" intensity={0.5} />
					<PerspectiveCamera makeDefault position={[0, 1, 10]} />
					<directionalLight
						position={[-5, 0, 10]}
						intensity={0.5}
						castShadow
						shadow-mapSize-width={2048}
						shadow-mapSize-height={2048}
						shadow-camera-far={50}
						shadow-camera-left={-20}
						shadow-camera-right={20}
						shadow-camera-top={20}
						shadow-camera-bottom={-20}
					/>
					{/* <ambientLight intensity={0.5} /> */}
					{/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
					{/* <pointLight position={[-10, -10, -10]} /> */}
					<Plane position={[0, 0, -2]} args={[100, 100]} receiveShadow>
						<shadowMaterial attach="material" opacity={0.1} />
					</Plane>
					<Bounds fit margin={1.2}>
						<Float speed={0.5}>
							<Select enabled>
								<animated.group scale={[5, 5, 5]} position-x={1}>
									{/* <Select enabled> */}
									<FryingPan rotation={[Math.PI / 4, 0.2, 0]} />
									{/* </Select> */}
									{/* <Select enabled> */}
									<FryingPanLid
										rotation={[-Math.PI / 6, 0.2, 0.5]}
										position={[0, 0.5, 0]}
									/>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										rotation={[-Math.PI / 3, Math.PI / 6, Math.PI / 3]}
										position={[-0.05, 0.1, 0.3]}
									>
										<Float floatIntensity={0.3}>
											<OnionHalf />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										rotation={[Math.PI / 2, Math.PI / 6, Math.PI / 3]}
										position={[0.2, 0.25, 0.2]}
									>
										<Float floatIntensity={0.3}>
											<Tomato />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										position={[-0.4, 0.3, 0.2]}
										rotation={[Math.PI / 3, -Math.PI / 6, -0.8]}
									>
										<Float floatIntensity={0.3}>
											<CookingSpoon />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										position={[0.6, 0.3, 0.1]}
										rotation={[Math.PI, -Math.PI, -1]}
									>
										<Float floatIntensity={0.3}>
											<ShakerSalt />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										position={[0.3, 0.4, 0.2]}
										rotation={[Math.PI / 8, 0, -0.8]}
									>
										<Float floatIntensity={0.3}>
											<PepperMill />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										rotation={[0, Math.PI / 12, -0.4]}
										position={[-0.1, 0, 0.2]}
									>
										<Float floatIntensity={0.3}>
											<Leek scale={[0.8, 0.8, 0.8]} />
										</Float>
									</group>
									{/* </Select> */}
									{/* <Select enabled> */}
									<group
										position={[0.15, 0.05, 0.25]}
										rotation={[Math.PI / 8, Math.PI / 4, 0.6]}
									>
										<Float floatIntensity={0.3}>
											<Garlic />
										</Float>
									</group>
									{/* </Select> */}
								</animated.group>
							</Select>
						</Float>
					</Bounds>
					<EffectComposer multisampling={0} autoClear={false}>
						<Outline
							visibleEdgeColor={0x000000}
							hiddenEdgeColor={0x000000}
							edgeStrength={1}
							// width={Resizer.AUTO_SIZE}
							// height={Resizer.AUTO_SIZE}
							width={1000}
							height={1000}
							blur={false}
						/>
					</EffectComposer>
				</Selection>
				<SoftShadows />
			</Suspense>
		</Canvas>
	);
}

export default Scene;
