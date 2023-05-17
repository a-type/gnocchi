'use client';

import { Form as FormikForm } from 'formik';
import { withClassName } from '../../hooks/withClassName.js';

export const Form = withClassName(
	FormikForm,
	'flex flex-col gap-2 items-start',
);
