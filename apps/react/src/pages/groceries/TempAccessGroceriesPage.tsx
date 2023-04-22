import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { NotFoundPage } from '@/pages/NotFoundPage.jsx';
import {
	AddBar,
	List,
	ThemedPageRoot,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import { createClientDescriptor, hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { Box } from '@aglio/ui/components/box';
import { LinkButton } from '@/components/nav/Link.jsx';
import { Form, SubmitButton, TextField } from '@aglio/ui/components/forms';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { FullScreenSpinner } from '@aglio/ui/components/spinner';
import { TextLink } from '@/components/nav/Link.jsx';
import { H1, P } from '@aglio/ui/components/typography';
import { Formik } from 'formik';
import { Suspense, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from '@lo-fi/react-router';

export function TempAccessGroceriesPage() {
	const params = useParams();
	const code = params.code as string;

	const { data, isLoading, refetch } =
		trpc.invites.temporaryAccessDetails.useQuery({
			code,
		});
	const claim = trpc.invites.claimTemporary.useMutation();

	if (isLoading) {
		return <FullScreenSpinner />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	if (!data.name) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Join {data.listName} for today</H1>
					<P>Welcome to Gnocchi.club, your new favorite cooking app!</P>
					<P>
						You've been invited to collaborate on this grocery list for the next
						day.
					</P>
					<P>
						Want to start your own list? It's already waiting for you, just
						click{' '}
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
							<Box fontSize="sm">
								By continuing you agree to the{' '}
								<TextLink href="/tos" target="_blank">
									Terms of Service
								</TextLink>
							</Box>
						</Form>
					</Formik>
				</PageContent>
			</PageRoot>
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
					<ThemedPageRoot listId={listId}>
						<PageContent fullHeight noPadding nav={false}>
							<Box
								p={3}
								gap={1}
								direction="column"
								align="flex-start"
								background="accentWash"
								color="accentInk"
								borderRadius="lg"
							>
								<P>This link lets you view someone else's list.</P>
								<LinkButton
									size="small"
									to="/welcome"
									target="_blank"
									color="accent"
								>
									Start your own list
								</LinkButton>
							</Box>
							<TopControls>
								<ListSelect includeAll value={listId} onChange={onListChange} />
							</TopControls>
							<AddBar />
							<List />
							<UnknownListRedirect listId={listId} />
						</PageContent>
					</ThemedPageRoot>
				</ListContext.Provider>
			</Suspense>
		</hooks.Provider>
	);
}

export default TempAccessGroceriesPage;
