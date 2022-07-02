import { GetServerSideProps } from 'next';

export default function Home() {
	return <div />;
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: '/groceries',
			permanent: false,
		},
	};
};
