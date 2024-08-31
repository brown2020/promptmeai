// MarkdownComponent.tsx
import React, { useEffect } from 'react';
import { marked } from 'marked';

interface MarkdownComponentProps {
    markdownText: string;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = ({ markdownText }) => {
    const [htmlContent, setHtmlContent] = React.useState('');
    // Function to convert Markdown text to HTML
    const markdownToHTML = async (markdownText: string) => {
        const res = await marked(markdownText);
        setHtmlContent(res)
    };

    // Convert Markdown text to HTML

    useEffect(() => {

        markdownToHTML(markdownText)

    }, [markdownText])

    return (
        <div className='leading-loose' dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
};

export default MarkdownComponent;
