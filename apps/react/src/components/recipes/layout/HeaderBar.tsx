import { LinkButton } from '@/components/nav/Link.jsx';
import { PageFixedArea } from '@aglio/ui/src/components/layouts';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import classNames from 'classnames';
import * as classes from './HeaderBar.css.js';

export interface HeaderBarProps {
	children?: ReactNode;
	backUrl: string;
	className?: string;
}

export function HeaderBar({ children, backUrl, className }: HeaderBarProps) {
	return (
		<PageFixedArea className={classNames(classes.fixedArea, className)}>
			<LinkButton to={backUrl} color="ghost">
				<ArrowLeftIcon />
				Back
			</LinkButton>
			{children}
		</PageFixedArea>
	);
}
