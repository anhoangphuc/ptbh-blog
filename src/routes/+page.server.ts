import { redirect } from '@sveltejs/kit';

export function load() {
	// Redirect home page to articles page
	throw redirect(307, '/articles');
}
