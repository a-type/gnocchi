import { trpc, RouterOutputs } from '@/trpc.js';
import { H2 } from '../primitives/index.js';

export interface SyncManagerProps {}

type PlanData = RouterOutputs['admin']['plans'][number];

export function SyncManager({}: SyncManagerProps) {
	const { data: plans, refetch } = trpc.admin.plans.useQuery();

	return (
		<div>
			<H2>Reset sync</H2>
			{plans?.map((plan) => (
				<SyncPlanManager plan={plan} key={plan.id} onChange={refetch} />
			))}
		</div>
	);
}
``;
function SyncPlanManager({
	plan,
	onChange,
}: {
	plan: PlanData;
	onChange?: () => void;
}) {
	const reset = trpc.admin.resetSync.useMutation();
	return (
		<div>
			<div>{plan.id}</div>
			<div>
				{plan.members
					.slice(0, 3)
					.map((member) => `${member.fullName} [${member.email}]`)
					.join(', ')}
			</div>

			<button
				onClick={async () => {
					if (confirm('Are you sure?')) {
						reset.mutate({
							planId: plan.id,
						});
						onChange?.();
					}
				}}
			>
				RESET SYNC
			</button>
		</div>
	);
}
