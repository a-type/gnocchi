import { ReactNode, useState } from 'react';
import { Particles } from './particlesState.js';
import { createPortal } from 'react-dom';
import { ParticlesProvider } from './ParticleContext.js';

export function ParticleLayer({ children }: { children: ReactNode }) {
	const [particles] = useState(() => new Particles({ initialPoolSize: 100 }));

	return (
		<ParticlesProvider value={particles}>
			{createPortal(
				<canvas
					ref={particles.setCanvas}
					className="fixed inset-0 w-full h-full z-overdraw pointer-events-none"
				/>,
				document.body,
			)}
			{children}
		</ParticlesProvider>
	);
}
