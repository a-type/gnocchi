import { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

export interface NoteProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export function Note({ className, children, ...rest }: NoteProps) {
	return (
		<div className={classNames('pr-20px', className)} {...rest}>
			<div className="flex flex-col p-2 border border-solid border-primary-dark bg-primary-wash color-black relative text-sm italic border-r-0">
				{children}
				<div className="w-20px h-[calc(100%-18px)] absolute bottom--0.5px right--20px border-0 border-solid border-primary-dark border-r border-b bg-primary-wash">
					<div
						className={`absolute top--20px left-0 border-10px border-0 border-solid border-transparent border-b-primary-dark border-l-primary-dark after:(content-[""] absolute top--7px left--9px border-8px border-solid border-transparent border-b-primary-wash border-l-primary-wash)`}
					/>
				</div>
			</div>
		</div>
	);
}
