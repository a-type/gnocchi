import classNames from 'classnames';

export function TagIcon({
	fill,
	...props
}: {
	className?: string;
	fill?: boolean;
}) {
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
				d="M2 7V2H7L14 9L9 14L2 7Z"
				stroke="currentColor"
				strokeLinejoin="round"
				className={classNames({
					'fill-primary': fill,
				})}
			/>
			<circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
		</svg>
	);
}
