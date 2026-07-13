import type { ReactNode } from 'react';

/**
 * Renders passage text with simple markup:
 *   __text__  → underline
 *   **text**  → bold
 *   _text_    → italic
 *
 * These can be nested and mixed with plain text.
 */
export function renderRichText(text: string): ReactNode {
  if (!text) return null;

  // Process in order: underline (__), bold (**), italic (_)
  // We split by patterns and build ReactNode arrays

  const parts: ReactNode[] = [];
  // Regex: match __underline__, **bold**, or _italic_ — non-greedy
  const regex = /(__(.+?)__)|(\*\*(.+?)\*\*)|(_(.+?)_)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[1]) {
      // __underline__
      parts.push(
        <u key={`u${keyIdx++}`} style={{ textDecorationThickness: '2px', textUnderlineOffset: '3px' }}>
          {renderRichText(match[2])}
        </u>
      );
    } else if (match[3]) {
      // **bold**
      parts.push(
        <strong key={`b${keyIdx++}`} style={{ fontWeight: 700 }}>
          {renderRichText(match[4])}
        </strong>
      );
    } else if (match[5]) {
      // _italic_
      parts.push(
        <em key={`i${keyIdx++}`}>
          {renderRichText(match[6])}
        </em>
      );
    }

    lastIdx = match.index + match[0].length;
  }

  // Remaining text after last match
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  // If no matches found, return plain string
  if (parts.length === 0) return text;

  return <>{parts}</>;
}

/**
 * Insert formatting markers around selected text in a textarea.
 */
export function insertFormatting(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
  currentValue: string,
  onChange: (newValue: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end);

  if (selected) {
    // Wrap selection
    const newValue = currentValue.slice(0, start) + prefix + selected + suffix + currentValue.slice(end);
    onChange(newValue);
    // Restore cursor after React re-renders
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  } else {
    // Insert markers and place cursor between them
    const newValue = currentValue.slice(0, start) + prefix + suffix + currentValue.slice(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }
}
