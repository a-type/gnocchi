import { prisma } from 'src/data/prisma.js';

const productAdmins = (process.env.MAKE_PRODUCT_ADMIN || '').split(',');

export async function productAdminSetup() {
	for (const email of productAdmins) {
		const user = await prisma.profile.findUnique({ where: { email } });
		if (user && !user.isProductAdmin) {
			await prisma.profile.update({
				where: { id: user.id },
				data: { isProductAdmin: true },
			});
			console.log('Made', email, 'a product admin');
		}
	}
}
