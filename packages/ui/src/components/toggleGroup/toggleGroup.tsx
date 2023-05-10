import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { withClassName } from '../../styles.js';
import classNames from 'classnames';
import * as classes from './toggleGroup.css.js';

export const ToggleGroupRoot = withClassName(ToggleGroup.Root, classes.root);
export const ToggleGroupItem = withClassName(ToggleGroup.Item, classes.item);
