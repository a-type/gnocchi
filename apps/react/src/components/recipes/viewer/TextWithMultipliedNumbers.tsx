import { Tooltip } from '@a-type/ui/components/tooltip';
import { Icon } from '@a-type/ui/components/icon';

export interface TextWithMultipliedNumbersProps {
	text: string | null;
	multiplier: number;
}

export function TextWithMultipliedNumbers({
	text,
	multiplier,
}: TextWithMultipliedNumbersProps) {
	if (multiplier === 1) return <>{text}</>;
	if (!text) return <>{text}</>;
	// This regex matches any number with a decimal point, or any number with a fraction
	const numberRegex = /(\d+\.\d+|\d+\/\d+|\d+)/g;
	const matches = text.match(numberRegex);
	if (!matches) return <>{text}</>;
	const fragments = text.trim().split(numberRegex);
	return (
		<>
			{fragments.map((fragment, index) => {
				const isNumber = /(\d+\.\d+|\d+\/\d+|\d+)/.test(fragment);
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
									{parseFloat(fragment) * multiplier}
								</span>
							</Tooltip>
						)}
					</span>
				);
			})}
		</>
	);
}
