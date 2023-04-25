import { Formik, FormikConfig, FormikHelpers, FormikValues } from 'formik';
import { Form } from './Form.jsx';
import { useCallback } from 'react';

export interface FormikFormProps<T extends FormikValues = FormikValues>
	extends FormikConfig<T> {
	className?: string;
}

export function FormikForm<Values extends FormikValues>({
	className,
	children,
	onSubmit,
	...props
}: FormikFormProps<Values>) {
	const wrappedOnSubmit = useCallback(
		async (values: Values, bag: FormikHelpers<Values>) => {
			try {
				bag.setSubmitting(true);
				return await onSubmit(values, bag);
			} finally {
				bag.setSubmitting(false);
			}
		},
		[onSubmit],
	);

	if (typeof children === 'function') {
		return (
			<Formik<Values> onSubmit={wrappedOnSubmit} {...props}>
				{(formik) => <Form className={className}>{children(formik)}</Form>}
			</Formik>
		);
	}

	return (
		<Formik<Values> onSubmit={wrappedOnSubmit} {...props}>
			<Form className={className}>{children}</Form>
		</Formik>
	);
}
