import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './ChatBubble.css';

function renderers() {
  return {
    math: ({ value }) => (
      <div className="my-4">
        <BlockMath 
          math={value} 
          settings={{
            throwOnError: false,
            displayMode: true,
            strict: false
          }}
        />
      </div>
    ),
    inlineMath: ({ value }) => (
      <InlineMath 
        math={value} 
        settings={{
          throwOnError: false,
          strict: false
        }}
      />
    ),
  };
}

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex flex-col mb-6 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`w-full px-6 py-4 rounded-2xl shadow-lg ${
        isUser 
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
          : 'bg-gray-800/90 backdrop-blur-sm text-pink-100 border border-pink-500/30'
      }`}>
        <div className="text-xl font-normal leading-relaxed">
          <ReactMarkdown
            children={message.content}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={renderers()}
            skipHtml={false}
          />
        </div>
      </div>
      <span className="text-xs text-pink-400 mt-2 font-light">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default ChatBubble;
