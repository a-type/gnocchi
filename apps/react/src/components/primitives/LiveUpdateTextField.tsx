import {
	ChangeEvent,
	FocusEvent,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { debounce } from '@a-type/utils';
import { Input, InputProps } from './primitives.jsx';

export type LiveUpdateTextFieldProps = Omit<
	InputProps,
	'value' | 'onChange'
> & {
	value: string;
	debounceMs?: number;
	onChange: (value: string) => void;
};

/**
 * An extension of TextField which keeps a local realtime value in state and
 * periodically reports changes to the parent. Use this to connect
 * to the API and update a value from the field directly.
 *
 * This component is optimistic and will not respond to external changes while focused.
 */
export const LiveUpdateTextField = forwardRef<
	HTMLInputElement,
	LiveUpdateTextFieldProps
>(function LiveUpdateTextField(
	{ value, onChange, debounceMs = 500, onFocus, onBlur, ...rest },
	ref,
) {
	const [displayValue, setDisplayValue] = useState(value || '');
	const ignoreUpdates = useRef(false);
	const didChange = useRef(false);

	const handleFocus = useCallback(
		(ev: FocusEvent<HTMLInputElement>) => {
			onFocus?.(ev);
			ignoreUpdates.current = true;
		},
		[onFocus],
	);

	const handleBlur = useCallback(
		(ev: FocusEvent<HTMLInputElement>) => {
			onBlur?.(ev);
			ignoreUpdates.current = false;
			// immediately send update if the user typed anything.
			// otherwise pull the latest remote value
			if (didChange.current) {
				onChange?.(displayValue);
			} else {
				setDisplayValue(value || '');
			}
			didChange.current = false;
		},
		[onBlur, displayValue, onChange, value],
	);

	useEffect(() => {
		if (ignoreUpdates.current) {
			return;
		}
		setDisplayValue(value || '');
	}, [value]);

	// every once in a while, send an update to parent
	const debouncedOnChange = useMemo(
		() => debounce(onChange || (() => {}), debounceMs),
		[onChange, debounceMs],
	);

	// update local state instantly and parent eventually
	const handleChange = useCallback(
		(ev: ChangeEvent<any>) => {
			setDisplayValue(ev.target.value);
			debouncedOnChange(ev.target.value);
			didChange.current = true;
		},
		[debouncedOnChange],
	);

	return (
		<Input
			ref={ref}
			onFocus={handleFocus}
			onBlur={handleBlur}
			value={displayValue}
			onChange={handleChange}
			{...rest}
		/>
	);
});
