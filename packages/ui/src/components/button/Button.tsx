import classNames from 'classnames';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Spinner } from '../spinner.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	color?:
		| 'primary'
		| 'default'
		| 'ghost'
		| 'destructive'
		| 'ghostDestructive'
		| 'accent';
	size?: 'default' | 'small' | 'icon';
	toggled?: boolean;
	align?: 'start' | 'stretch' | 'end';
	visuallyDisabled?: boolean;
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			className,
			color,
			size,
			toggled,
			align,
			visuallyDisabled,
			loading,
			children,
			disabled,
			...props
		},
		ref,
	) {
		return (
			<button
				ref={ref}
				{...props}
				disabled={disabled || loading}
				data-disabled={visuallyDisabled}
				tabIndex={visuallyDisabled ? -1 : undefined}
				className={classNames(
					getButtonClassName({ color, size, toggled, align }),
					className,
				)}
			>
				{loading && <Spinner size={16} className="inline-block w-1em h-1em" />}
				{children}
			</button>
		);
	},
);

export function getButtonClassName({
	color,
	size,
	toggled,
	align,
}: {
	color?: ButtonProps['color'];
	size?: ButtonProps['size'];
	toggled?: boolean;
	align?: ButtonProps['align'];
}) {
	return classNames(
		'px-3 py-2 bg-[var(--bg)] [--webkit-tap-highlight-color:transparent] text-md font-sans border border-solid border-transparent rounded-md cursor-pointer font-bold flex flex-row gap-1 items-center relative overflow-visible select-none all:transition duration-200 shadow-none whitespace-nowrap',
		'hover:(bg-[var(--hover)] shadow-[0_0_0_6px_var(--hover)])',
		'focus:outline-off',
		'focus-visible:(outline-off shadow-[0_0_0_6px_var(--hover)])',
		'important:disabled:(opacity-50 cursor-default bg-[(--var-bg)] shadow-none)',
		'[&[data-disabled=true]]:(opacity-50 cursor-default)',
		'active:(shadow-[0_0_0_6px_var(--active)] bg-[var(--active)])',
		colors[color ?? 'default'],
		`color-${color ?? 'default'}`,
		sizes[size ?? 'default'],
		`size-${size ?? 'default'}`,
		toggled && toggledClass,
		align && aligns[align],
		// compound variants
		color === 'ghost' && toggled && 'bg-primary-wash',
	);
}

const colors = {
	primary: `[&.color-primary]:([--bg:var(--color-primary-light)] [--hover:var(--color-primary)] [--active:var(--color-primary)] color-black border-black focus-visible:([--bg:var(--color-primary)]))`,
	accent: `[&.color-accent]:([--bg:var(--color-accent-wash)] [--hover:var(--color-accent-light)] [--active:var(--color-accent-light)] color-black border-black focus-visible:([--bg:var(--color-accent-light)]))`,
	default: `[&.color-default]:([--bg:var(--color-white)] [--hover:var(--color-gray-2)] [--active:var(--color-gray-3)] color-black border-black)`,
	ghost: `[&.color-ghost]:([--bg:transparent] [--hover:var(--color-gray-blend)] [--active:var(--color-gray-dark-blend)] color-dark-blend hover:([--bg:var(--color-gray-blend)]) focus-visible:([--bg:var(--color-gray-blend)]))`,
	destructive: `[&.color-destructive]:([--bg:var(--color-attention-light)] [--hover:var(--color-attention-light)] [--active:var(--color-attention-light)] border-black color-black hover:([--bg:var(--colors-attention)]))`,
	ghostDestructive: `[&.color-ghost-destructive]:([--bg:transparent] [--hover:var(--color-attention-light)] [--active:var(-color-attention-light)] color-attention-dark)`,
};

const sizes = {
	default: '',
	small: '[&.size-small]:(px-3 py-1 text-sm rounded-lg)',
	icon: '[&.size-icon]:(px-1 py-1 text-sm rounded-full)',
};

const toggledClass = 'hover:(filter-brightness-[1.1])';

const aligns = {
	start: 'self-start',
	stretch: 'self-stretch',
	end: 'self-end',
};
