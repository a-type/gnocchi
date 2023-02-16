export interface UploadIconProps {
	className?: string;
}

export function UploadIcon(props: UploadIconProps) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1.5 10V11.5C1.5 12.6046 2.39543 13.5 3.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V10M7.5 10.5V1M7.5 1L4 4M7.5 1L11 4"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
