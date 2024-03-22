import React, { useState, useEffect, useRef } from 'react';

export default function TextBox({
    paragraphs,
    isTyping,
    handleTyping,
    setTypedParagraphs,
    setAllParagraphsTyped,
    typedParagraphs,
    speed = 60
}) {
    const [currentText, setCurrentText] = useState(''); // Text being typed
    const [currentParagraph, setCurrentParagraph] = useState(0); // Keep track of paragraph being typed

    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                // Build string that is displayed in typing style
                const nextChar = paragraphs[currentParagraph]?.substring(currentText?.length, currentText?.length + 1);
                if (nextChar) {
                    setCurrentText(currentText + nextChar);
                } else {
                    // If there is not next character, move to next paragraph
                    setCurrentParagraph(currentParagraph + 1);
                    // Prevent currentText from being set as undefined
                    setCurrentText(currentText === '' ? '' : paragraphs[currentParagraph - 1] || '');
                    const updatedTypedParagraphs = [...typedParagraphs];
                    // Mark previous paragraph as typed
                    updatedTypedParagraphs[currentParagraph] = true;
                    setTypedParagraphs(updatedTypedParagraphs);
                    // Check for last paragraph
                    if (currentParagraph > paragraphs.length) {
                        handleTyping();
                        setAllParagraphsTyped(true);
                    }
                }
            }, speed);

            return () => clearInterval(interval);
        }
    }, [isTyping, currentText, currentParagraph]);

    return (
        <div className="text_box">
            {paragraphs.map((paragraph, index) => {
                return (
                    <p key={index}>
                        {typedParagraphs[index] ? paragraph : (isTyping && currentParagraph === index ? currentText : '')}
                    </p>
                )
            })}
        </div>
    );
}