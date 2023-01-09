import { PageNowPlaying } from '@/components/layouts/index.jsx';
import { Button } from '@/components/primitives/index.js';
import { useToggle } from '@/hooks/useToggle.jsx';
import { Recipe } from '@aglio/groceries-client';
import { ListBulletIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { UIEvent, useCallback, useEffect, useRef } from 'react';
import * as classes from './CookingToolbar.css.js';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';

export interface CookingToolbarProps {
	recipe: Recipe;
}

const PEEK_HEIGHT = 110;
const MAX_HEIGHT = 300;

export function CookingToolbar({ recipe }: CookingToolbarProps) {
	const [open, toggleOpen] = useToggle();

	const listRef = useRef<HTMLUListElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const openRef = useRef(open);
	openRef.current = open;

	const onScroll = useCallback((ev: UIEvent) => {
		const container = containerRef.current;
		if (!container) return;
		if (!openRef.current) return;

		const scrollRoot = ev.target as HTMLDivElement;
		const listHeight = Math.min(
			MAX_HEIGHT,
			listRef.current?.clientHeight ?? MAX_HEIGHT,
		);
		const currentHeight = container.clientHeight;
		if (currentHeight >= listHeight) {
			return;
		}
		if (scrollRoot.scrollTop > 0) {
			const height = Math.max(
				PEEK_HEIGHT,
				currentHeight + Math.abs(scrollRoot.scrollTop),
			);

			container.getAnimations().forEach((animation) => {
				animation.cancel();
			});
			container.style.height = height + 'px';
			scrollRoot.scrollTo({ top: 0 });
		}
	}, []);

	useEffect(() => {
		requestAnimationFrame(() => {
			const container = containerRef.current;
			if (!container) return;
			if (open) {
				scrollRef.current?.scrollTo({ top: 0 });
				container.animate([{ height: '0px' }, { height: `${PEEK_HEIGHT}px` }], {
					fill: 'forwards',
					easing: 'ease-in-out',
					duration: 200,
					id: 'open',
				});
			} else {
				container.style.height = '0px';
			}
		});
	}, [open]);

	return (
		<PageNowPlaying unstyled className={classes.root}>
			<ToggleButton open={open} onToggle={toggleOpen} />
			<div
				ref={containerRef}
				className={classnames(classes.container, open && classes.containerOpen)}
			>
				<div
					className={classes.containerScroll}
					ref={scrollRef}
					onScroll={onScroll}
				>
					<RecipeIngredientsViewer recipe={recipe} ref={listRef} />
				</div>
			</div>
		</PageNowPlaying>
	);
}

function ToggleButton({
	open,
	onToggle,
}: {
	open: boolean;
	onToggle: () => void;
}) {
	return (
		<Button
			className={classes.toggleButton}
			color={open ? 'primary' : 'default'}
			onClick={onToggle}
		>
			<ListBulletIcon />
		</Button>
	);
}
