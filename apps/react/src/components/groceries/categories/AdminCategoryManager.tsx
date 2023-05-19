import { trpc } from '@/trpc.js';
import { Button } from '@aglio/ui/components/button';
import { Form, TextField } from '@aglio/ui/components/forms';
import { Input } from '@aglio/ui/components/input';
import { H1, H2 } from '@aglio/ui/components/typography';
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
	} = trpc.categories.defaults.useQuery();
	const { mutate: createCategory } =
		trpc.categories.createDefault.useMutation();

	const categoryKeys = useMemo(
		() => (categories ? categories.map((cat) => cat.sortKey) : []),
		[categories],
	);
	const reversedCategoryKeys = useMemo(
		() => [...categoryKeys].reverse(),
		[categoryKeys],
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-10">
			<H1>Default Categories</H1>
			<div className="flex flex-col gap-6">
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
			</div>
			<div>
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
			</div>
		</div>
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
	const { mutate: updateCategory } = trpc.categories.updateDefault.useMutation({
		onSuccess: onChange,
	});
	const { mutate: deleteCategory } = trpc.categories.deleteDefault.useMutation({
		onSuccess: onChange,
	});

	const [name, setName] = useState(category.name);
	useEffect(() => {
		setName(category.name);
	}, [category.name]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Input value={name} onChange={(ev) => setName(ev.target.value)} />
				<Button onClick={() => updateCategory({ id: category.id, name })}>
					Update
				</Button>
			</div>
			<div className="flex justify-between">
				<div>
					<Button
						size="small"
						onClick={() => {
							deleteCategory(category.id);
						}}
						color="destructive"
					>
						Delete
					</Button>
				</div>
				<div className="flex gap-2 items-center">
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
				</div>
			</div>
		</div>
	);
}

export default AdminCategoryManager;
