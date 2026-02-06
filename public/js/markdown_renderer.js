
// Configure marked with KaTeX
if (typeof marked !== 'undefined' && typeof markedKatex !== 'undefined') {
    marked.use(markedKatex({
        throwOnError: false,
        displayMode: false // default, will detect $$ for display
    }));
}

export function renderMarkdown(text) {
    if (!text) return '';
    // Pre-process to ensure LaTeX is friendly for marked-katex if needed
    // Usually standard $...$ works with the extension.
    return marked.parse(text);
}
