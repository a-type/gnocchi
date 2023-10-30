'use client';

import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
	ComponentPropsWithRef,
	ComponentType,
	ElementType,
	FunctionComponent,
	ReactNode,
	createContext,
	forwardRef,
	useContext,
} from 'react';
import classNames from 'classnames';
import { withClassName } from '../../hooks/withClassName.js';

export const SelectItem = forwardRef<
	HTMLDivElement,
	SelectPrimitive.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
	const isNative = useContext(IsNativeContext);

	if (isNative) {
		return <option value={props.value}>{children}</option>;
	}

	return (
		<SelectItemRoot className={className} {...props} ref={forwardedRef}>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectItemIndicator />
		</SelectItemRoot>
	);
});

export const SelectItemRoot = withClassName(
	SelectPrimitive.Item,
	'text-md leading-4 color-black rounded-sm flex items-center flex-row h-36px pr-4 pl-35px relative select-none',
	'[&[data-disabled]]:(color-gray5 pointer-events-none) [&[data-highlighted]]:(outline-none bg-primary-wash color-black)',
);
export const SelectItemIndicatorRoot = withClassName(
	SelectPrimitive.ItemIndicator,
	'absolute left-0 w-25px inline-flex items-center justify-center',
);
export const SelectItemIndicator = withNoNativeRender(
	(props: SelectPrimitive.SelectItemIndicatorProps) => (
		<SelectItemIndicatorRoot {...props}>
			<CheckIcon />
		</SelectItemIndicatorRoot>
	),
);
export const SelectItemText = withClassName(SelectPrimitive.ItemText, '');
export const SelectGroup = (props: SelectPrimitive.SelectGroupProps) => {
	const isNative = useContext(IsNativeContext);

	if (isNative) {
		return (
			<optgroup id={props.id} className={props.className}>
				{props.children}
			</optgroup>
		);
	}

	return <SelectPrimitive.Group {...props} />;
};

export const SelectRoot = SelectPrimitive.Root;
export const selectTriggerClassName =
	'layer-components:([all:unset] inline-flex items-center justify-center rounded-full px-3 py-1 text-sm gap-2 color-black border-solid border border-gray5 hover:border-gray7 focus:shadow-focus [&[data-placeholder]]:color-gray8) select-none';
export const SelectTrigger = withNoNativeRender(
	withClassName(SelectPrimitive.Trigger, selectTriggerClassName),
);
export const UnstyledSelectTrigger = withNoNativeRender(
	SelectPrimitive.Trigger,
);

export const SelectValue = withNoNativeRender(
	withClassName(SelectPrimitive.Value, 'flex flex-row'),
);
export const SelectLabel = withNoNativeRender(
	withClassName(
		SelectPrimitive.Label,
		'px-25px text-xs leading-6 color-black select-none',
	),
);
export const SelectSeparator = withNoNativeRender(
	withClassName(SelectPrimitive.Separator, 'h-1px bg-gray50 m-1'),
);
export const SelectIcon = withNoNativeRender(
	forwardRef<HTMLDivElement, SelectPrimitive.SelectIconProps>(
		({ className, ...props }, forwardedRef) => {
			return (
				<SelectPrimitive.Icon
					className={classNames('color-inherit', className)}
					{...props}
					ref={forwardedRef}
				>
					<ChevronDownIcon />
				</SelectPrimitive.Icon>
			);
		},
	),
);

const zIndex = { zIndex: 1001 };
export const SelectContent = withPassthroughNativeRender(
	forwardRef<
		HTMLDivElement,
		SelectPrimitive.SelectContentProps & { inDialog?: boolean }
	>(({ children, inDialog, className, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Portal className={className} style={zIndex}>
				<SelectPrimitive.Content
					className={classNames(
						'layer-components:(overflow-hidden bg-white rounded-lg border border-solid border-1 border-black z-menu shadow-lg)',
						'layer-components:transform-origin-[var(--radix-select-content-transform-origin)]',
						'layer-components:[&[data-state=open]]:animate-popover-in',
						'layer-components:[&[data-state=closed]]:animate-popover-out',
						'layer-components:(min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)])',
						inDialog && 'z-[calc(var(--z-dialog)+1)]',
					)}
					{...props}
					ref={forwardedRef}
				>
					<SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-25px bg-white color-primary-dark cursor-default">
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpButton>
					<SelectPrimitive.Viewport className="p-1">
						{children}
					</SelectPrimitive.Viewport>
					<SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-25px bg-white color-primary-dark cursor-default">
						<ChevronDownIcon />
					</SelectPrimitive.ScrollDownButton>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		);
	}),
);

export const NativeSelect = forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, forwardedRef) => {
	return (
		<div className={classNames('relative', className)}>
			<select
				className={classNames(
					'appearance-none font-inherit bg-white inline-flex items-center justify-center rounded-full px-3 py-1 pr-8 text-sm gap-2 color-black border-solid border border-gray5 hover:border-gray7 focus:outline-none focus-visible:shadow-focus [&[data-placeholder]]:color-gray8',
				)}
				{...props}
				ref={forwardedRef}
			/>
			<div className="absolute right-1 top-50% translate-y-[-50%] pointer-events-none">
				<ChevronDownIcon className="w-4 h-4 m-2" />
			</div>
		</div>
	);
});

export type SelectProps<T extends string = string> = {
	children?: ReactNode;
	value: T;
	onValueChange?: (value: T) => void;
	className?: string;
	id?: string;
	/** Native on mobile; otherwise use custom select impl */
	mobileNative?: boolean;
	/** won't work on mobile and mobileNative=true */
	open?: boolean;
	/** won't work on mobile and mobileNative=true */
	onOpenChange?: (open: boolean) => void;
};
/**
 * A high-level Select which converts to native on mobile. Use with SelectItem.
 */
export const Select = <T extends string = string>({
	children,
	value,
	onValueChange,
	mobileNative,
	...rest
}: SelectProps<T>) => {
	const mobile = isMobile();

	if (mobile && mobileNative) {
		return (
			<IsNativeContext.Provider value={true}>
				<NativeSelect
					onChange={(ev) => {
						onValueChange?.(ev.target.value as any);
					}}
					value={value}
					{...rest}
				>
					{children}
				</NativeSelect>
			</IsNativeContext.Provider>
		);
	}

	return (
		<SelectRoot value={value} onValueChange={onValueChange}>
			{children}
		</SelectRoot>
	);
};

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

// facilitate the auto native switching
const IsNativeContext = createContext(false);

function withNoNativeRender<T extends ComponentType<any> | ElementType<any>>(
	Component: T,
): FunctionComponent<ComponentPropsWithRef<T>> {
	const WithNoNativeRender = forwardRef<any, any>((props, ref) => {
		const isNative = useContext(IsNativeContext);

		if (isNative) return null;

		return <Component ref={ref} {...props} />;
	});
	return WithNoNativeRender as any;
}

function withPassthroughNativeRender<
	T extends ComponentType<any> | ElementType<any>,
>(Component: T): FunctionComponent<ComponentPropsWithRef<T>> {
	const WithPassthroughNativeRender = forwardRef<any, any>((props, ref) => {
		const isNative = useContext(IsNativeContext);

		if (isNative) {
			return <>{props.children}</>;
		}

		return <Component ref={ref} {...props} />;
	});
	return WithPassthroughNativeRender as any;
}
