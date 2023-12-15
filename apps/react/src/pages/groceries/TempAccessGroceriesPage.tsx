import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { NotFoundPage } from '@/pages/NotFoundPage.jsx';
import {
	AddBar,
	List,
	ThemedPageContent,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import { createClientDescriptor, hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { LinkButton } from '@/components/nav/Link.jsx';
import { Form, SubmitButton, TextField } from '@a-type/ui/components/forms';
import { PageContent, PageRoot } from '@a-type/ui/components/layouts';
import { FullScreenSpinner } from '@a-type/ui/components/spinner';
import { TextLink } from '@/components/nav/Link.jsx';
import { H1, P } from '@a-type/ui/components/typography';
import { Formik } from 'formik';
import { Suspense, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';

export function TempAccessGroceriesPage() {
	const params = useParams();
	const code = params.code as string;

	const { data, isLoading, refetch } =
		trpc.invites.temporaryAccessDetails.useQuery({
			code,
		});
	const claim = trpc.invites.claimTemporary.useMutation();

	const listName = data?.listName || 'Groceries';
	usePageTitle(listName);

	if (isLoading) {
		return <FullScreenSpinner />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	if (!data.name) {
		return (
			<PageContent>
				<H1>Join {data.listName} for today</H1>
				<P>Welcome to Gnocchi.club, your new favorite cooking app!</P>
				<P>
					You've been invited to collaborate on this grocery list for the next
					day.
				</P>
				<P>
					Want to start your own list? It's already waiting for you, just click{' '}
					<TextLink to="/" newTab>
						here
					</TextLink>
					. No signup necessary.
				</P>
				{/* TODO: more tutorial stuff here */}
				<Formik
					initialValues={{ name: '' }}
					onSubmit={async ({ name }, bag) => {
						try {
							await claim.mutateAsync({
								name,
								code,
							});
							refetch();
						} catch (err) {
							toast.error(`Failed to claim this invite`);
						} finally {
							bag.setSubmitting(false);
						}
					}}
				>
					<Form>
						<TextField name="name" required placeholder="Your name" />
						<SubmitButton>Join in</SubmitButton>
						<div className="text-sm">
							By continuing you agree to the{' '}
							<TextLink to="/tos" newTab>
								Terms of Service
							</TextLink>
						</div>
					</Form>
				</Formik>
			</PageContent>
		);
	}

	return <TempAccessGroceriesView code={code} />;
}

function TempAccessGroceriesView({ code }: { code: string }) {
	const navigate = useNavigate();

	const onListChange = useCallback(
		(listId: string | null | undefined) => {
			if (listId === undefined) {
				navigate(`/temp/${code}`);
			} else if (listId === null) {
				navigate(`/temp/${code}/null`);
			} else {
				navigate(`/temp/${code}/${listId}`);
			}
		},
		[navigate],
	);
	const { listId: listIdParam } = useParams();
	const listId = listIdParam === 'null' ? null : listIdParam;

	const clientDescriptor = useMemo(() => {
		const desc = createClientDescriptor({ namespace: `temp_${code}` });
		desc.readyPromise.then((client) => {
			(window as any).tempGroceries = client;
		});
		return desc;
	}, [code]);

	return (
		<hooks.Provider value={clientDescriptor} sync>
			<Suspense>
				<ListContext.Provider value={listId}>
					<ThemedPageContent listId={listId}>
						<div className="flex flex-col p-3 gap-1 items-start bg-accent-wash color-accent-ink rounded-lg">
							<P>This link lets you view someone else's list.</P>
							<LinkButton size="small" to="/welcome" newTab color="accent">
								Start your own list
							</LinkButton>
						</div>
						<TopControls>
							<ListSelect includeAll value={listId} onChange={onListChange} />
						</TopControls>
						<AddBar />
						<List />
						<UnknownListRedirect listId={listId} />
					</ThemedPageContent>
				</ListContext.Provider>
			</Suspense>
		</hooks.Provider>
	);
}

export default TempAccessGroceriesPage;
