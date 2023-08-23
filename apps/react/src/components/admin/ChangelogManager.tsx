import { trpc } from '@/trpc.js';
import { Button } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Form, TextAreaField, TextField } from '@aglio/ui/components/forms';
import format from 'date-fns/format';
import { Formik } from 'formik';

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
	return (
		<Formik
			initialValues={changelog}
			onSubmit={async (values) => {
				await mutateAsync(values);
				onChange();
			}}
		>
			<Form>
				<TextField name="title" label="Title" />
				<TextField name="details" label="Details" />
				<Button type="submit">Save</Button>
			</Form>
		</Formik>
	);
}

function ChangelogCreator({ onCreate }: { onCreate: () => void }) {
	const { mutateAsync } = trpc.changelog.addChangelog.useMutation();
	return (
		<Formik
			initialValues={{ title: '', details: '' }}
			onSubmit={async (values) => {
				await mutateAsync(values);
				onCreate();
			}}
		>
			<Form>
				<TextField name="title" label="Title" />
				<TextAreaField name="details" label="Details" />
				<Button type="submit">Add</Button>
			</Form>
		</Formik>
	);
}
