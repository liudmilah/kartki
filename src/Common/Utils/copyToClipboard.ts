function copyToClipboard(text: string): void {
    if (!navigator.clipboard) {
        document.execCommand('copy');
        return;
    }
    navigator.clipboard.writeText(text).catch((e) => {
        console.error(e);
    });
}

export { copyToClipboard };
