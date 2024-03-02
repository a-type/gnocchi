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
	const fragments = text.split(numberRegex);
	console.log(fragments);
	return (
		<>
			{fragments.map((fragment, index) => (
				<span key={index}>
					{index % 2 === 0 && fragment}
					{matches[index] && (
						<Tooltip
							content={
								<span className="text-wrap max-w-80vw">
									Multiplier {multiplier}x applied. Original value:{' '}
									{matches[index]}
								</span>
							}
						>
							<span className="multiplied-number text-accent-dark font-bold flex-row inline-flex items-center gap-0.5">
								{parseFloat(matches[index]) * multiplier}
							</span>
						</Tooltip>
					)}
				</span>
			))}
		</>
	);
}
