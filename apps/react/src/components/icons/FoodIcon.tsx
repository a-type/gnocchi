export interface FoodIconProps {
	className?: string;
}

export function FoodIcon({ className }: FoodIconProps) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<g clipPath="url(#clip0_611_45)">
				<path
					d="M7.49992 0.5V2M7.49992 4.5V2M7.49992 4.5C3.5 3 2 4 1.49994 6.5C0.999871 9 2.99993 13.5 4.49994 14C5.99994 14.5 6.99992 13.5 7.49992 13.5C7.99992 13.5 9.49992 14.5 10.4999 14C11.4999 13.5 13.9999 9 13.4999 6.5C13 4 11.6173 3.03149 7.49992 4.5ZM7.49992 2C7.49992 2 9.49992 0.499977 10.4999 0.5C11.0522 0.500013 11.6746 0.976057 11.4999 1.5C11.3618 1.91421 11.4999 2 10.4999 2C9.32835 2 7.49992 2 7.49992 2Z"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_611_45">
					<rect width="15" height="15" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
