import isWithinInterval from 'date-fns/isWithinInterval';
import startOfDay from 'date-fns/startOfDay';

export function ProductHunt({ className }: { className?: string }) {
	const isLaunchDay = isWithinInterval(new Date(), {
		start: startOfDay(new Date('Tue, 28 Mar 2023 07:01:00 GMT')),
		end: startOfDay(new Date('Tue, 29 Mar 2023 07:01:00 GMT')),
	});

	if (!isLaunchDay) {
		return null;
	}

	return (
		<a
			href="https://www.producthunt.com/posts/gnocchi-club?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gnocchi&#0045;club"
			target="_blank"
			className={className}
		>
			<img
				src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386174&theme=light"
				alt="Gnocchi&#0046;club - Organize&#0032;and&#0032;collaborate&#0032;on&#0032;your&#0032;weekly&#0032;cooking | Product Hunt"
				style={{ width: '100%', height: '100%', objectFit: 'contain' }}
			/>
		</a>
	);
}
