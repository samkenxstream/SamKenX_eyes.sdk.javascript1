/* eslint-disable */

function extractCssResources() {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"],style')).map(el => {
    if (el.tagName.toUpperCase() === 'LINK') {
      return 'href:' + el.getAttribute('href');
    }

    return 'text:' + el.textContent;
  });
}

return extractCssResources();
