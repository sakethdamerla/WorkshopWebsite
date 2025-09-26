import React from 'react';

export default function LiveQnA({ messages, chatInput, onChatInputChange, onChatSubmit }) {
  return (
    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-neutral-800">Live Q&A</h3>
      <div className="h-64 overflow-y-auto mb-4 p-3 bg-white border rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.user === 'You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.user === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-neutral-800'}`}>
              <span className="font-bold block text-sm">{msg.user}</span>
              <p className="text-base">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={onChatSubmit} className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={onChatInputChange}
          placeholder="Ask a question..."
          className="flex-grow mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">Send</button>
      </form>
    </div>
  );
}