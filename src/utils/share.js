// Share utility — uses Web Share API on mobile, clipboard fallback on desktop.
// Passing a url separately enables rich previews on Facebook, iMessage, etc.

export async function shareText(text, onCopied, url) {
  if (navigator.share) {
    try {
      const shareData = { text };
      if (url) {
        shareData.url = url;
        shareData.title = 'Ask Grace';
      }
      await navigator.share(shareData);
      return true;
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  // Clipboard fallback — include URL in the copied text
  try {
    const clipText = url && !text.includes(url) ? `${text}\n${url}` : text;
    await navigator.clipboard.writeText(clipText);
    if (onCopied) onCopied();
    return true;
  } catch {
    return false;
  }
}
