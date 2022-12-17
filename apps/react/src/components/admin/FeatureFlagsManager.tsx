import { featureFlags } from '@/featureFlags.js';
import { trpc, RouterOutputs } from '@/trpc.js';
import { ErrorBoundary } from '../primitives/ErrorBoundary.jsx';
import { H2 } from '../primitives/index.js';

export interface FeatureFlagsManagerProps {}

type PlanData = RouterOutputs['admin']['plans'][number];

export function FeatureFlagsManager({}: FeatureFlagsManagerProps) {
	const { data: plans, refetch } = trpc.admin.plans.useQuery();

	return (
		<div>
			<H2>Feature flags</H2>
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
		updateFlags.mutate({ planId: plan.id, featureFlags: {} });
		onChange?.();
	};

	return (
		<ErrorBoundary
			fallback={<button onClick={() => reset()}>Invalid flags. Reset?</button>}
		>
			<FeatureFlagPlanManager plan={plan} />
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
	return (
		<div>
			<div>{plan.id}</div>
			<div>
				{plan.members
					.slice(0, 3)
					.map((member) => `${member.fullName} [${member.email}]`)
					.join(', ')}
			</div>
			<ul>
				{Object.keys(featureFlags).map((flagName) => (
					<li key={flagName}>
						<input
							type="checkbox"
							checked={!!flags[flagName]}
							onChange={async () => {
								updateFlags.mutate({
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
		</div>
	);
}
