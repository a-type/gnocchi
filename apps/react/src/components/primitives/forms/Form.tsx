import { Form as FormikForm } from 'formik';
import { withClassName } from '@/hocs/withClassName.jsx';
import * as classes from './Form.css.js';
import '@/styles/sprinkles.css.js';

export const Form = withClassName(FormikForm, classes.form);
