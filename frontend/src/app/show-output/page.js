"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDownIcon, ChevronRightIcon, SpeakerWaveIcon, PauseCircleIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

export default function OutputPage() {
    const [data, setData] = useState([]);
    const [openAccordionId, setOpenAccordionId] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [readingIndex, setReadingIndex] = useState(null);

    useEffect(() => {
        const fetchData = JSON.parse(localStorage.getItem('agentResponse')) || [];
        setData(fetchData);
        if (fetchData.length > 0) {
            setOpenAccordionId(fetchData.length - 1);
        }
    }, []);

    const toggleAccordion = (index) => {
        setOpenAccordionId(openAccordionId === index ? null : index);
    };

    const copyToClipboard = (text, index) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
            }, err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            console.error('Clipboard API not available or not in a secure context');
        }
    };

    const toggleReadAloud = (text, index) => {
        if (readingIndex === index) {
            window.speechSynthesis.cancel();
            setReadingIndex(null);
        } else {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setReadingIndex(null);
            window.speechSynthesis.speak(utterance);
            setReadingIndex(index);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-center text-2xl font-bold py-4 fixed top-0 left-0 right-0 bg-white z-10 text-red-500">Output Page</h1>
            <div className="pt-20">
                {data.map((item, index) => (
                    <div key={index} className="relative border-l-2 border-gray-300 pl-8 my-8 last:border-l-0">
                        <div onClick={() => toggleAccordion(index)} className={`absolute -left-3 top-1 mt-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center cursor-pointer ${openAccordionId === index ? 'bg-blue-700' : 'bg-blue-500'}`}>
                            {openAccordionId === index ? <ChevronDownIcon className="w-4 h-4 text-white" /> : <ChevronRightIcon className="w-4 h-4 text-white" />}
                        </div>
                        <div onClick={() => toggleAccordion(index)} className="clear-both flex items-center text-left cursor-pointer">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{item.agent}</h2>
                                <p className="text-gray-600">{item.task}</p>
                            </div>
                        </div>
                        {openAccordionId === index && (
                            <div className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
                                <ReactMarkdown
                                    children={item.response}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        a: ({ node, ...props }) => <a {...props} style={{ color: 'blue' }} target="_blank" rel="noopener noreferrer" />
                                    }}
                                />
                                <button onClick={() => toggleReadAloud(item.response, index)} className="absolute top-2 right-12 py-1.5 text-red-500 hover:text-black-700">
                                    {readingIndex === index ? <PauseCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                                </button>
                                <button onClick={() => copyToClipboard(item.response, index)} className="absolute top-2 right-2 p-2 text-red-500 hover:text-black-700">
                                    {copiedIndex === index ? <ClipboardDocumentCheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}