export interface MeetupIconProps {
	className?: string;
}

export function MeetupIcon(props: MeetupIconProps) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#clip0_401_232)">
				<circle cx="7.5" cy="7.5" r="5" stroke="currentColor" />
				<circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
				<path
					d="M4 7.5H0.5M11 7.5H14.5M7.5 4V0.5M7.5 11V14.5"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_401_232">
					<rect width="15" height="15" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
