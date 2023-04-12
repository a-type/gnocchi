import { createContext, useContext } from 'react';
import { Particles } from './particlesState.js';

const ParticleContext = createContext<Particles | null>(null);

export function useParticles() {
	const particles = useContext(ParticleContext);
	return particles;
}

export const ParticlesProvider = ParticleContext.Provider;
