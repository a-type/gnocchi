import { Tooltip } from '@a-type/ui/components/tooltip';
import { Icon } from '@a-type/ui/components/icon';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';

export interface TextWithMultipliedNumbersProps {
	text: string | null;
	multiplier: number;
}

// This regex matches any number with a decimal point, or any number with a fraction.
// however, if the number ends with a degree symbol, or "F" or "C", it does not match
// any part of it. for example, "350F" would not match, but "350" would.
// but also "350F" would not match "35"... but also "45cans" would match.
const numberRegex = /(\d+\.\d+|\d+\/\d+|\d+)(?!\d*\s*[FC°])/g;

export function TextWithMultipliedNumbers({
	text,
	multiplier,
}: TextWithMultipliedNumbersProps) {
	const enabled = useFeatureFlag('multipliedIngredients');
	if (!enabled) return <>{text}</>;
	if (multiplier === 1) return <>{text}</>;
	if (!text) return <>{text}</>;

	const matches = text.match(numberRegex);
	if (!matches) return <>{text}</>;
	const fragments = text.trim().split(numberRegex);
	console.log(fragments);
	return (
		<>
			{fragments.map((fragment, index) => {
				const isNumber = numberRegex.test(fragment);
				return (
					<span key={index}>
						{!isNumber && fragment}
						{isNumber && (
							<Tooltip
								content={
									<span className="text-wrap max-w-80vw">
										Multiplier {multiplier}x applied. Original value: {fragment}
									</span>
								}
							>
								<span className="multiplied-number text-accent-dark font-bold flex-row inline-flex items-center gap-0.5">
									{parseFloat(fragment.trim()) * multiplier}
								</span>
							</Tooltip>
						)}
					</span>
				);
			})}
		</>
	);
}
