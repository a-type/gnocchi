import { Form, TextField } from '@/components/primitives/forms.jsx';
import {
	Box,
	Button,
	H1,
	H2,
	Input,
} from '@/components/primitives/primitives.jsx';
import { trpc } from '@/trpc.js';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Formik } from 'formik';
import { generateKeyBetween } from 'fractional-indexing';
import { useEffect, useMemo, useState } from 'react';

function getNextAndPrevSortKeys(
	sortKeys: string[],
	reversedSortKeys: string[],
	currentSortKey: string,
) {
	const prev = reversedSortKeys.find((key) => key < currentSortKey);
	const prevPrev = prev ? reversedSortKeys.find((key) => key < prev) : null;
	const next = sortKeys.find((key) => key > currentSortKey);
	const nextNext = next ? sortKeys.find((key) => key > next) : null;
	return {
		prev: generateKeyBetween(prevPrev ?? null, prev ?? null),
		next: generateKeyBetween(next ?? null, nextNext ?? null),
	};
}

export function AdminCategoryManager() {
	const {
		data: categories,
		isLoading,
		refetch,
	} = trpc.useQuery(['categories.defaults']);
	const { mutate: createCategory } = trpc.useMutation([
		'categories.createDefault',
	]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const categoryKeys = useMemo(
		() => (categories ? categories.map((cat) => cat.sortKey) : []),
		[categories],
	);
	const reversedCategoryKeys = useMemo(
		() => [...categoryKeys].reverse(),
		[categoryKeys],
	);

	return (
		<Box gap={10}>
			<H1>Default Categories</H1>
			<Box gap={6}>
				{categories?.map((cat, i) => {
					const { prev, next } = getNextAndPrevSortKeys(
						categoryKeys,
						reversedCategoryKeys,
						cat.sortKey,
					);

					return (
						<AdminCategoryItem
							category={cat}
							key={cat.id}
							prevSortKey={prev}
							nextSortKey={next}
							onChange={refetch}
						/>
					);
				})}
			</Box>
			<Box>
				<Formik
					initialValues={{ name: '' }}
					onSubmit={async (values) => {
						await createCategory({
							...values,
							sortKey: generateKeyBetween(
								null,
								categories?.[categories.length - 1]?.sortKey ?? null,
							),
						});
					}}
				>
					<Form>
						<H2>New Category</H2>
						<TextField name="name" label="Name" />
						<Button type="submit">Create</Button>
					</Form>
				</Formik>
			</Box>
		</Box>
	);
}

function AdminCategoryItem({
	category,
	prevSortKey,
	nextSortKey,
	onChange,
}: {
	category: { name: string; id: string; sortKey: string };
	prevSortKey: string | null;
	nextSortKey: string | null;
	onChange?: () => void;
}) {
	const { mutate: updateCategory } = trpc.useMutation(
		['categories.updateDefault'],
		{
			onSuccess: onChange,
		},
	);
	const { mutate: deleteCategory } = trpc.useMutation(
		['categories.deleteDefault'],
		{
			onSuccess: onChange,
		},
	);

	const [name, setName] = useState(category.name);
	useEffect(() => {
		setName(category.name);
	}, [category.name]);

	return (
		<Box gap={2}>
			<Box direction="row" align="center" gap={2}>
				<Input value={name} onChange={(ev) => setName(ev.target.value)} />
				<Button onClick={() => updateCategory({ id: category.id, name })}>
					Update
				</Button>
			</Box>
			<Box justify="spaceBetween" direction="row">
				<Box>
					<Button
						size="small"
						onClick={() => {
							deleteCategory(category.id);
						}}
						color="destructive"
					>
						Delete
					</Button>
				</Box>
				<Box direction="row" gap={2} align="center">
					<span>
						{category.sortKey} ({prevSortKey},{nextSortKey})
					</span>
					<Button
						size="small"
						color="ghost"
						disabled={!prevSortKey}
						onClick={() => {
							updateCategory({ id: category.id, sortKey: prevSortKey! });
						}}
					>
						<ArrowUpIcon />
					</Button>
					<Button
						size="small"
						color="ghost"
						disabled={!nextSortKey}
						onClick={() => {
							updateCategory({ id: category.id, sortKey: nextSortKey! });
						}}
					>
						<ArrowDownIcon />
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
