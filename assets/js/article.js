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
                    <span class="me-3"><i class="far fa-clock me-1"></i> ${article.reading_time_minutes} min read</span>
                    <span><i class="far fa-heart me-1 text-danger"></i> ${article.public_reactions_count} Reactions</span>
                </div>
                <div class="article-body">
                    ${article.body_html}
                </div>
                <div class="mt-4 pt-4 border-top">
                    <div class="mb-3">${tagsHtml}</div>
                    <a href="${article.url}" target="_blank" class="btn btn-outline-primary btn-sm">View on Dev.to <i class="fas fa-external-link-alt ms-1"></i></a>
                </div>
                
                <!-- Comments Section -->
                <div class="mt-5 pt-4 border-top">
                    <h3 class="mb-4">Comments</h3>
                    <div id="comments-container">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-border text-primary spinner-sm" role="status">
                                <span class="visually-hidden">Loading comments...</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Fetch comments, catching errors locally to not break the article view
            return fetch(`https://dev.to/api/comments?a_id=${article.id}`)
                .then(res => res.json())
                .catch(err => null); // Return null on comment error
        })
        .then(comments => {
            const commentsContainer = document.getElementById('comments-container');
            if (comments === null) {
                if (commentsContainer) commentsContainer.innerHTML = '<p class="text-danger small">Failed to load comments.</p>';
            } else if (comments.length === 0) {
                if (commentsContainer) commentsContainer.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment on Dev.to!</p>';
            } else {
                if (commentsContainer) commentsContainer.innerHTML = comments.map(comment => renderComment(comment)).join('');
            }
        })
        .catch(error => {
            console.error('Error fetching article:', error);
            articleContainer.innerHTML = '<div class="text-center text-danger"><h3>Error loading article.</h3><p>It may have been removed or is unavailable.</p><a href="poetry.html" class="btn btn-primary mt-3">Go Back</a></div>';
        });

    function renderComment(comment) {
        const childrenHtml = comment.children && comment.children.length > 0 
            ? `<div class="ms-4 mt-3 ps-3 border-start">${comment.children.map(child => renderComment(child)).join('')}</div>` 
            : '';

        return `
            <div class="comment-card mb-3 p-3 glass-card-sm">
                <div class="d-flex align-items-center mb-2">
                    <img src="${comment.user.profile_image_90}" alt="${comment.user.name}" class="rounded-circle me-2" width="30" height="30">
                    <div>
                        <div class="fw-bold small">${comment.user.name}</div>
                        <div class="text-muted small" style="font-size: 0.8rem;">${new Date(comment.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="comment-body mb-2">${comment.body_html}</div>
                ${childrenHtml}
            </div>
        `;
    }
});
