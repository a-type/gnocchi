// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';

// Rewrites /r/publisher/title-text-then-slug to /r/publisher/slug
export function middleware(request: NextRequest) {
	const pathParams = request.nextUrl.pathname.split('/');
	const slug = pathParams.pop();
	if (!slug) {
		return NextResponse.next();
	}
	const slugWithoutTitle = slug.split('-').pop();
	if (!slugWithoutTitle) {
		return NextResponse.next();
	}
	pathParams.push(slugWithoutTitle);
	return NextResponse.rewrite(new URL(`${pathParams.join('/')}`, request.url));
}

export const config = {
	matcher: '/r/:publisherId/:slug',
};
