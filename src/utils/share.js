// Share utility — uses Web Share API on mobile, clipboard fallback on desktop

export async function shareText(text, onCopied) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  // Clipboard fallback
  try {
    await navigator.clipboard.writeText(text);
    if (onCopied) onCopied();
    return true;
  } catch {
    return false;
  }
}
