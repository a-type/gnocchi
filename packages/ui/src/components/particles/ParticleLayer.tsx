import { ReactNode, useState } from 'react';
import * as classes from './ParticleLayer.css.js';
import { Particles } from './particlesState.js';
import { createPortal } from 'react-dom';
import { ParticlesProvider } from './ParticleContext.js';

export function ParticleLayer({ children }: { children: ReactNode }) {
	const [particles] = useState(() => new Particles({ initialPoolSize: 100 }));

	return (
		<ParticlesProvider value={particles}>
			{createPortal(
				<canvas ref={particles.setCanvas} className={classes.canvas} />,
				document.body,
			)}
			{children}
		</ParticlesProvider>
	);
}
