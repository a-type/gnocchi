import { trpc } from '@/trpc.js';
import { Button } from '@a-type/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import {
	FormikForm,
	TextAreaField,
	TextField,
} from '@a-type/ui/components/forms';
import format from 'date-fns/format';

export function ChangelogManager() {
	const { data, refetch } = trpc.changelog.getChangelogs.useQuery({});

	return (
		<div>
			<ChangelogCreator onCreate={refetch} />
			<ul>
				{data?.map((changelog) => (
					<Dialog>
						<DialogTrigger asChild>
							<li className="font-bold underline">
								{changelog.title} (
								{format(new Date(changelog.createdAt), 'yyyy-MM-dd')})
							</li>
						</DialogTrigger>
						<DialogContent>
							<ChangelogEditor changelog={changelog} onChange={refetch} />
						</DialogContent>
					</Dialog>
				))}
			</ul>
		</div>
	);
}

function ChangelogEditor({
	changelog,
	onChange,
}: {
	changelog: { id: string; title: string; details: string };
	onChange: () => void;
}) {
	const { mutateAsync } = trpc.changelog.updateChangelog.useMutation();
	const { mutateAsync: deleteItem } =
		trpc.changelog.deleteChangelog.useMutation();
	return (
		<>
			<FormikForm
				initialValues={changelog}
				onSubmit={async (values) => {
					await mutateAsync(values);
					onChange();
				}}
			>
				<TextField name="title" label="Title" />
				<TextAreaField name="details" label="Details" />
				<Button type="submit">Save</Button>
			</FormikForm>
			<DialogActions>
				<Button
					color="destructive"
					onClick={async () => {
						await deleteItem({
							id: changelog.id,
						});
						onChange();
					}}
				>
					Delete
				</Button>
				<DialogClose asChild>
					<Button>Close</Button>
				</DialogClose>
			</DialogActions>
		</>
	);
}

function ChangelogCreator({ onCreate }: { onCreate: () => void }) {
	const { mutateAsync } = trpc.changelog.addChangelog.useMutation();
	return (
		<FormikForm
			initialValues={{ title: '', details: '' }}
			onSubmit={async (values) => {
				await mutateAsync(values);
				onCreate();
			}}
		>
			<TextField name="title" label="Title" />
			<TextAreaField name="details" label="Details" />
			<Button type="submit">Add</Button>
		</FormikForm>
	);
}
