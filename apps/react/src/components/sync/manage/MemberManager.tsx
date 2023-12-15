import { useAuth } from '@/hooks/useAuth.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { InviteLinkButton } from '../InviteLinkButton.jsx';
import { ManageSubscriptionButton } from '../ManageSubscriptionButton.jsx';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { Button } from '@a-type/ui/components/button';
import { H2, P } from '@a-type/ui/components/typography';
import { Checkbox } from '@a-type/ui/components/checkbox';

export interface MemberManagerProps {}

export function MemberManager({}: MemberManagerProps) {
	const { data } = useAuth();
	const { session } = data || {};

	if (!session) return null;

	const content =
		session.role === 'admin' ? <AdminMemberManager /> : <MemberMemberManager />;

	return (
		<Dialog>
			<div>
				<DialogTrigger asChild>
					<Button>Manage membership</Button>
				</DialogTrigger>
				<span className="text-xs">
					{session.role === 'admin'
						? 'Update subscription, remove members, etc'
						: 'Leave your current plan'}
				</span>
			</div>
			<DialogContent>
				<DialogTitle>Manage Membership</DialogTitle>
				{content}
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function AdminMemberManager() {
	const { data: members, refetch } = trpc.plan.members.useQuery();
	const { data } = useAuth();
	const { session } = data || {};

	return (
		<div className="flex flex-col gap-2">
			<P>
				You're the admin of this plan. You can invite new members and update
				billing information. If you end your subscription, all members will lose
				subscriber features.
			</P>
			<InviteLinkButton align="start" color="primary" />
			<ManageSubscriptionButton align="start">
				Change billing or cancel subscription
			</ManageSubscriptionButton>
			<H2>Members</H2>
			{members
				?.filter((m) => m.id !== session?.userId)
				.map((member) => (
					<AdminMemberItem key={member.id} member={member} onRemove={refetch} />
				))}
			{!members?.length && <P>No members yet</P>}
		</div>
	);
}

function AdminMemberItem({
	member,
	onRemove,
}: {
	member: {
		id: string;
		fullName: string;
		imageUrl?: string | null;
		email: string;
	};
	onRemove?: () => void;
}) {
	const kick = trpc.plan.kick.useMutation();
	const [confirmOpen, setConfirmOpen] = useState(false);

	return (
		<div className="flex justify-between items-center gap-2">
			<P>
				{member.fullName} ({member.email})
			</P>
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogTrigger asChild>
					<Button size="small" color="destructive">
						Remove
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Remove member</DialogTitle>
					<P>
						Are you sure you want to remove {member.fullName} from this plan?
					</P>
					<P>They will no longer be able to sync with you.</P>
					<Button
						align="start"
						color="destructive"
						onClick={async () => {
							try {
								await kick.mutateAsync({ id: member.id });
								setConfirmOpen(false);
								onRemove?.();
							} catch (err) {
								console.error(err);
								toast.error('Failed to remove member. Try again?');
							}
						}}
					>
						Remove
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function MemberMemberManager() {
	const leave = trpc.plan.leave.useMutation();
	const [confirmed, setConfirmed] = useState(false);
	const [alsoClear, setAlsoClear] = useState(false);
	const client = hooks.useClient();

	const confirmLeave = async () => {
		await leave.mutateAsync();
		if (alsoClear) {
			(client as any).__dangerous__resetLocal();
		} else {
			client.sync.stop();
		}
	};

	return (
		<div className="flex flex-col gap-1">
			<P>
				You're a member of this plan. Only the person who invited you can invite
				new members or update billing.
			</P>

			<H2>Leave plan</H2>
			<P>
				You will no longer sync your list{' '}
				<strong>with other devices you own</strong>, or other members. To resume
				syncing on your own, you will need to purchase your own subscription
			</P>
			<div className="flex gap-2 p-2">
				<Checkbox
					checked={confirmed}
					onCheckedChange={(v) => setConfirmed(v === true)}
				/>
				I understand
			</div>
			<div className="flex flex-col border-light bg-gray1 p-2 mb-2">
				<div className="flex flex-row gap-2">
					<Checkbox
						checked={alsoClear}
						onCheckedChange={(v) => setAlsoClear(v === true)}
					/>
					Also reset my data
				</div>
				<P>Start with a clean slate after leaving</P>
			</div>
			<Button align="start" disabled={!confirmed} onClick={confirmLeave}>
				Leave Plan
			</Button>
		</div>
	);
}
