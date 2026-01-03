import { allArticles } from './articles';

export function load() {
	// Aggregate all articles from different categories
	// Sort articles by date in descending order (newest first)
	allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		articles: allArticles
	};
}
