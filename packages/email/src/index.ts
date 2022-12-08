import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.zoho.com',
	port: 465,
	secure: true,
	pool: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

transporter.verify().then((error) => {
	if (error) {
		console.error('Email error:', error);
	} else {
		console.log('Email ready');
	}
});

export async function sendEmailVerification({
	to,
	code,
}: {
	to: string;
	code: string;
}) {
	transporter.sendMail({
		from: 'hi@aglio.app',
		to,
		subject: 'Verify your email on Aglio',
		text: `Your verification code is ${code}`,
		html: `
    <div>
      <h1>Thanks for signing up to Aglio!</h1>
      <p>Click the button below to finish signing up on this device.</p>
      <a href="https://aglio.app/verify?code=${code}">Verify my email</a>
      <p>After that, you can sign in on any device you want to sync to.</p>
      <p>If you didn't request this email, you can safely ignore it.</p>
      <p>Thanks,</p>
      <p>Grant</p>
    </div>`,
	});
}
