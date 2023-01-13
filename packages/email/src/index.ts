import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.zoho.com',
	port: 465,
	secure: true,
	pool: true,
	auth: {
		user: process.env.EMAIL_USER?.trim() || '',
		pass: process.env.EMAIL_PASS?.trim() || '',
	},
});
transporter.verify().then((error) => {
	if (error !== true) {
		console.error('Email error:', error);
	} else {
		console.log('Email ready');
	}
});

export async function sendEmailVerification({
	to,
	code,
	returnTo,
	uiOrigin = 'https://gnocchi.club',
}: {
	to: string;
	code: string;
	returnTo?: string;
	uiOrigin?: string;
}) {
	transporter.sendMail({
		from: 'hi@gnocchi.club',
		to,
		subject: 'Verify your email on Gnocchi.club',
		text: `Your verification code is ${code}`,
		html: `
    <div>
      <h1>Thanks for signing up to Gnocchi.club!</h1>
      <p>Click the button below to finish signing up on this device.</p>
      <a href="${uiOrigin}/verify?code=${code}${
			returnTo ? `&returnTo=${returnTo}` : ''
		}">Verify my email</a>
      <p>After that, you can sign in on any device you want to sync to.</p>
      <p>If you didn't request this email, you can safely ignore it.</p>
      <p>Thanks,</p>
      <p>Grant</p>
    </div>`,
	});
}

export async function sendPasswordReset({
	to,
	code,
	returnTo,
	uiOrigin = 'https://gnocchi.club',
}: {
	to: string;
	code: string;
	returnTo?: string;
	uiOrigin?: string;
}) {
	transporter.sendMail({
		from: 'hi@gnocchi.club',
		to,
		subject: 'Reset your password on Gnocchi.club',
		text: `Your password reset code is ${code}`,
		html: `
		<div>
			<h1>Reset your password on Gnocchi.club</h1>
			<p>Click the link below to reset your password.</p>
			<a href="${uiOrigin}/reset-password?code=${code}${
			returnTo ? `&returnTo=${returnTo}` : ''
		}">Reset my password</a>
			<p>If you didn't request this email, you can safely ignore it.</p>
			<p>Thanks,</p>
			<p>Grant</p>
		</div>`,
	});
}
