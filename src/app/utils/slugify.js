// utils/slugify.js
export const slugify = (text, maxLength = 50) => {
    const slug = text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')          // Replace spaces with -
        .replace(/[^\w\-]+/g, '')      // Remove all non-word chars
        .replace(/\-\-+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')            // Trim - from start of text
        .replace(/-+$/, '');           // Trim - from end of text

    return slug.substring(0, maxLength); // Ensure the slug does not exceed maxLength
};



// utils/deslugify.js
export const deslugify = (slug) => {
    return slug
        .toString()
        .trim()
        .replace(/-/g, ' ')                // Replace hyphens with spaces
        .replace(/\s\s+/g, ' ')            // Replace multiple spaces with a single space
        .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()); // Capitalize each word
};

