import { FeatureFlagName, featureFlags } from '@/featureFlags.js';
import { RouterOutputs, trpc } from '@/trpc.js';
import { H2, P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/src/components/button';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import { ErrorBoundary } from '@aglio/ui/src/components/errorBoundary';
import classNames from 'classnames';
import { useState } from 'react';

export interface PlanManagerProps {}

type PlanData = RouterOutputs['admin']['plans'][number];

export function PlanManager({}: PlanManagerProps) {
	const { data: plans, refetch } = trpc.admin.plans.useQuery();

	return (
		<div className="flex gap-3 flex-col">
			<H2>Plans</H2>
			{plans?.map((plan) => (
				<FeatureFlagPlanManagerWrapper
					plan={plan}
					key={plan.id}
					onChange={refetch}
				/>
			))}
		</div>
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
	const deletePlan = trpc.admin.deletePlan.useMutation();
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-row justify-between items-center border-light p-2">
			<div>
				<div>
					{!plan.members.some((m) => m.role === 'admin') && (
						<b style={{ marginRight: 8 }}>🚩 no admin</b>
					)}
					<span>{plan.id}</span>
				</div>
				<P className="text-xs">
					{plan.members
						.slice(0, 3)
						.map((member) => `${member.fullName} [${member.email}]`)
						.join(', ')}
				</P>
				{plan.subscriptionStatus !== 'active' &&
					(plan.subscriptionStatus === 'trialing' ? (
						<i>📈 Trial</i>
					) : plan.subscriptionStatus ? (
						<b>🚩 Subscription {plan.subscriptionStatus}</b>
					) : (
						<i>📉 No subscription</i>
					))}
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
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
					<H2>Library Info</H2>
					{open && <PlanLibraryInfo planId={plan.id} />}
					<H2>Danger zone</H2>
					{plan.members.length === 0 && (
						<Button
							onClick={async () => {
								await deletePlan.mutateAsync({ planId: plan.id });
								onChange?.();
							}}
							color="destructive"
						>
							Delete
						</Button>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default PlanManager;

function PlanLibraryInfo({ planId }: { planId: string }) {
	const { data } = trpc.admin.planLibraryInfo.useQuery({ planId });

	return (
		<div>
			<div>
				<ul>
					<li>Operations: {data?.operationsCount}</li>
					<li>Baselines: {data?.baselinesCount}</li>
					<li>Server Order: {data?.latestServerOrder}</li>
				</ul>
			</div>
			<div>
				<ul>
					{data?.replicas.map((replica) => (
						<li
							key={replica.id}
							className={classNames({
								'opacity-50': replica.truant,
							})}
						>
							<b>
								Replica {replica.id} ({(replica as any).profile.name}):
							</b>
							<span>Acked Server Order: {replica.ackedServerOrder}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
