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

export function exportAsPDF(messages: Message[], documentTitle: string) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Chat: ${documentTitle}`, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Exported on: ${formatDate(new Date())}`, margin, yPosition);
    yPosition += 15;

    doc.setTextColor(0);

    messages.forEach((message, index) => {
        // new page need
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const role = message.role === 'user' ? 'User' : 'Assistant';
        const roleColor = message.role === 'user' ? [59, 130, 246] : [139, 92, 246];
        doc.setTextColor(...roleColor);
        doc.text(role, margin, yPosition);
        yPosition += 7;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);

        const lines = doc.splitTextToSize(message.content, maxLineWidth);
        lines.forEach((line: string) => {
            if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 6;
        });

        yPosition += 8;

        if (index < messages.length - 1) {
            doc.setDrawColor(200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }
    });

    doc.save(generateFilename(documentTitle, 'pdf'));
}
