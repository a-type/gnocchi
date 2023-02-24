export interface NoteIconProps {
	className?: string;
}

export function NoteIcon(props: NoteIconProps) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#clip0_610_45)">
				<path
					d="M9.5 0.5H0.5V14.5H14.5V5.5M9.5 0.5L14.5 5.5M9.5 0.5V5.5H14.5"
					stroke="currentColor"
				/>
			</g>
			<defs>
				<clipPath id="clip0_610_45">
					<rect width="15" height="15" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
