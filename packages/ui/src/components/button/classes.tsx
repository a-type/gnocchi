import classNames from 'classnames';
import type { ButtonProps } from './Button.jsx';

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
		'layer-components:(px-4 py-3 bg-[var(--bg)] [--webkit-tap-highlight-color:transparent] [line-height:1] text-size-md font-sans border border-solid border-transparent rounded-lg cursor-pointer font-bold flex flex-row gap-1 items-center relative overflow-visible select-none all:transition duration-200 shadow-none whitespace-nowrap)',
		'layer-components:hover:(bg-[var(--hover)] shadow-[0_0_0_6px_var(--hover)])',
		'layer-components:focus:outline-off',
		'focus-visible:(outline-off shadow-[0_0_0_6px_var(--hover)])',
		'active:(shadow-[0_0_0_6px_var(--active)] bg-[var(--active)])',
		'important:disabled:(opacity-50 cursor-default bg-[(--var-bg)] shadow-none)',
		'important:[&[data-disabled=true]]:(opacity-50 cursor-default bg-[(--var-bg)] shadow-none)',
		colors[color ?? 'default'],
		`color-${color ?? 'default'}`,
		sizes[size ?? 'default'],
		`size-${size ?? 'default'}`,
		toggled && toggledClass,
		align && aligns[align],
		// compound variants
		color === 'ghost' && toggled && 'layer-variants:bg-primary-wash',
	);
}

const colors = {
	primary: `layer-variants:[&.color-primary]:([--bg:var(--color-primary-light)] [--hover:var(--color-primary)] [--active:var(--color-primary)] color-black border-black focus-visible:([--bg:var(--color-primary)]))`,
	accent: `layer-variants:[&.color-accent]:([--bg:var(--color-accent-wash)] [--hover:var(--color-accent-light)] [--active:var(--color-accent-light)] color-black border-black focus-visible:([--bg:var(--color-accent-light)]))`,
	default: `layer-variants:[&.color-default]:([--bg:var(--color-white)] [--hover:var(--color-gray-2)] [--active:var(--color-gray-3)] color-black border-black)`,
	ghost: `layer-variants:[&.color-ghost]:([--bg:transparent] [--hover:var(--color-gray-blend)] [--active:var(--color-gray-dark-blend)] color-dark-blend hover:([--bg:var(--color-gray-blend)]) focus-visible:([--bg:var(--color-gray-blend)]))`,
	destructive: `layer-variants:[&.color-destructive]:([--bg:var(--color-attention-light)] [--hover:var(--color-attention-light)] [--active:var(--color-attention-light)] border-black color-black hover:([--bg:var(--colors-attention)]))`,
	ghostDestructive: `layer-variants:[&.color-ghostDestructive]:([--bg:transparent] [--hover:var(--color-attention-light)] [--active:var(-color-attention-light)] color-attention-dark)`,
};

const sizes = {
	default: '',
	small: 'layer-variants:[&.size-small]:(px-4 py-1 text-sm rounded-lg)',
	icon: 'layer-variants:[&.size-icon]:(p-2 text-sm rounded-full)',
};

const toggledClass = 'hover:(filter-brightness-[1.1])';

const aligns = {
	start: 'self-start',
	stretch: 'self-stretch',
	end: 'self-end',
};
