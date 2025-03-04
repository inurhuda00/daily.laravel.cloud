export async function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied successfully!');
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    } else {
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        console.log(successful ? 'Fallback: Copy successful' : 'Fallback: Copy failed');
    } catch (error) {
        console.error('Fallback: Unable to copy', error);
    }

    document.body.removeChild(textArea);
}
