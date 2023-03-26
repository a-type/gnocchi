'use client';

import { withClassName } from '../../withClassName.jsx';
import { Link } from 'react-router-dom';
import * as classes from './TextLink.css.js';

export const TextLink = withClassName('a', classes.root);
export const TextLocalLink = withClassName(Link, classes.root);
