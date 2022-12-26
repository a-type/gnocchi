import { sprinkles } from '@/styles/sprinkles.css.js';
import { clsx } from 'clsx';
import { SVGProps } from 'react';

export interface ScanIconProps extends SVGProps<SVGSVGElement> {
	className?: string;
}

export function ScanIcon(props: ScanIconProps) {
	return (
		<svg
			{...props}
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12.5 4.5V14.5H2.5V0.5H8.5M12.5 4.5L8.5 0.5M12.5 4.5H8.5V0.5"
				stroke="currentColor"
				strokeLinejoin="round"
			/>
			<circle cx="7" cy="8" r="2.5" stroke="currentColor" />
			<path d="M9 10L12.5 13.5" stroke="currentColor" strokeLinecap="round" />
		</svg>
	);
}
