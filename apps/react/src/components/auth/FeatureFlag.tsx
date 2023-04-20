import { FeatureFlagName } from '@/featureFlags.js';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { ReactNode } from 'react';

export interface FeatureFlagProps {
	children: ReactNode;
	flag: FeatureFlagName;
}

export function FeatureFlag({ flag, children }: FeatureFlagProps) {
	const enabled = useFeatureFlag(flag);
	return enabled ? <>{children}</> : null;
}
