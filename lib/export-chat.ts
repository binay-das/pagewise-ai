import jsPDF from 'jspdf';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};


function formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function generateFilename(documentTitle: string, extension: 'pdf' | 'md'): string {
    const safeTitle = documentTitle
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const timestamp = new Date().toISOString().split('T')[0];
    return `chat-${safeTitle}-${timestamp}.${extension}`;
}

export function exportAsMarkdown(messages: Message[], documentTitle: string) {
    const now = new Date();

    let markdown = `# Chat: ${documentTitle}\n`;
    markdown += `Exported on: ${formatDate(now)}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((message) => {
        const role = message.role === 'user' ? 'User' : 'Assistant';
        markdown += `**${role}**\n\n`;
        markdown += `${message.content}\n\n`;
        markdown += `---\n\n`;
    });

    // create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFilename(documentTitle, 'md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


