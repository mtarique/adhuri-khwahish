document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-content');
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        articleContainer.innerHTML = '<div class="text-center text-danger"><h3>Article not found.</h3><a href="poetry.html" class="btn btn-primary mt-3">Go Back</a></div>';
        return;
    }

    const username = 'ajay_pandey_efb031226b375';
    // Fetch user articles to find the ID or details, but ideally we need an endpoint for slug.
    // Dev.to API allows fetching by path: https://dev.to/api/articles/{username}/{slug}
    const apiUrl = `https://dev.to/api/articles/${username}/${slug}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Article not found');
            }
            return response.json();
        })
        .then(article => {
            document.title = `${article.title} - Adhuri Khwahish`;
            
            // Format content
            const imageHtml = article.cover_image ? `<img src="${article.cover_image}" class="img-fluid w-100 rounded mb-4" alt="${article.title}">` : '';
            const tagsHtml = article.tags.map(tag => `<span class="badge bg-secondary me-1">#${tag}</span>`).join('');
            
            articleContainer.innerHTML = `
                ${imageHtml}
                <h1 class="mb-3 display-4 fw-bold">${article.title}</h1>
                <div class="d-flex align-items-center mb-4 text-muted">
                    <span class="me-3"><i class="far fa-calendar-alt me-1"></i> ${new Date(article.published_at).toLocaleDateString()}</span>
                    <span><i class="far fa-clock me-1"></i> ${article.reading_time_minutes} min read</span>
                </div>
                <div class="article-body">
                    ${article.body_html}
                </div>
                <div class="mt-4 pt-4 border-top">
                    <div class="mb-3">${tagsHtml}</div>
                    <a href="${article.url}" target="_blank" class="btn btn-outline-primary btn-sm">View on Dev.to <i class="fas fa-external-link-alt ms-1"></i></a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching article:', error);
            articleContainer.innerHTML = '<div class="text-center text-danger"><h3>Error loading article.</h3><p>It may have been removed or is unavailable.</p><a href="poetry.html" class="btn btn-primary mt-3">Go Back</a></div>';
        });
});
