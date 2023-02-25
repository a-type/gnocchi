import { FeatureFlagName, featureFlags } from '@/featureFlags.js';
import { RouterOutputs, trpc } from '@/trpc.js';
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
	ErrorBoundary,
	H2,
	P,
} from '@aglio/ui';

export interface PlanManagerProps {}

type PlanData = RouterOutputs['admin']['plans'][number];

export function PlanManager({}: PlanManagerProps) {
	const { data: plans, refetch } = trpc.admin.plans.useQuery();

	return (
		<Box gap={3}>
			<H2>Plans</H2>
			{plans?.map((plan) => (
				<FeatureFlagPlanManagerWrapper
					plan={plan}
					key={plan.id}
					onChange={refetch}
				/>
			))}
		</Box>
	);
}

function FeatureFlagPlanManagerWrapper({
	plan,
	onChange,
}: {
	plan: PlanData;
	onChange?: () => void;
}) {
	const updateFlags = trpc.admin.updateFeatureFlags.useMutation();
	const reset = async () => {
		await updateFlags.mutateAsync({ planId: plan.id, featureFlags: {} });
		onChange?.();
	};

	return (
		<ErrorBoundary
			fallback={<button onClick={() => reset()}>Invalid flags. Reset?</button>}
		>
			<FeatureFlagPlanManager plan={plan} onChange={onChange} />
		</ErrorBoundary>
	);
}

function FeatureFlagPlanManager({
	plan,
	onChange,
}: {
	plan: PlanData;
	onChange?: () => void;
}) {
	const flags = JSON.parse(plan.featureFlags || '{}');
	const updateFlags = trpc.admin.updateFeatureFlags.useMutation();
	const updateMember = trpc.admin.updateProfile.useMutation();

	return (
		<Box
			direction="row"
			justify="space-between"
			borderWidth="default"
			borderColor="gray50"
			borderStyle="solid"
			padding={2}
			align="center"
		>
			<div>
				<div>
					{!plan.members.some((m) => m.role === 'admin') && (
						<b style={{ marginRight: 8 }}>🚩 no admin</b>
					)}
					<span>{plan.id}</span>
				</div>
				<P size="xs">
					{plan.members
						.slice(0, 3)
						.map((member) => `${member.fullName} [${member.email}]`)
						.join(', ')}
				</P>
				{plan.subscriptionStatus !== 'active' &&
				plan.subscriptionStatus === 'trialing' ? (
					<i>📈 Trial</i>
				) : plan.subscriptionStatus ? (
					<b>🚩 Subscription {plan.subscriptionStatus}</b>
				) : (
					<i>📉 No subscription</i>
				)}
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Edit</Button>
				</DialogTrigger>
				<DialogContent>
					<H2>Feature flags</H2>
					<ul>
						{Object.keys(featureFlags).map((flagName) => (
							<li key={flagName}>
								<input
									type="checkbox"
									checked={
										!!flags[flagName] ||
										featureFlags[flagName as FeatureFlagName]
									}
									disabled={featureFlags[flagName as FeatureFlagName]}
									onChange={async () => {
										await updateFlags.mutateAsync({
											planId: plan.id,
											featureFlags: {
												...flags,
												[flagName]: !flags[flagName],
											},
										});
										onChange?.();
									}}
								/>
								<label>{flagName}</label>
							</li>
						))}
					</ul>
					<H2>Members</H2>
					<ul>
						{plan.members.map((member) => (
							<li key={member.id}>
								<span>
									{member.fullName} [{member.email}]
								</span>
								<select
									value={member.role}
									onChange={async (ev) => {
										await updateMember.mutateAsync({
											profileId: member.id,
											role: ev.target.value,
										});
										onChange?.();
									}}
								>
									<option value="admin">Admin</option>
									<option value="user">User</option>
								</select>
							</li>
						))}
					</ul>
				</DialogContent>
			</Dialog>
		</Box>
	);
}

export default PlanManager;
