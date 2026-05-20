chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      title: document.title,
      url: window.location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });
  }

  if (message.type === 'CAPTURE_SCREENSHOT') {
    captureScreenshot().then((dataUrl) => sendResponse({ dataUrl }));
    return true;
  }
});

async function captureScreenshot(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { resolve(''); return; }
    // Attempt to draw visible viewport via html2canvas-like approach
    // (best-effort; works only for same-origin or permissive pages)
    try {
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><body xmlns="http://www.w3.org/1999/xhtml">${document.documentElement.outerHTML}</body></foreignObject></svg>`;
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); resolve(canvas.toDataURL('image/png')); };
      img.onerror = () => resolve('');
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    } catch {
      resolve('');
    }
  });
}
