import React from 'react';

export default function MyNotes({ notes, onNotesChange }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-neutral-800">My Notes</h3>
      <textarea
        value={notes}
        onChange={onNotesChange}
        placeholder="Jot down your notes here..."
        className="w-full h-80 mt-1 p-3 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      ></textarea>
    </div>
  );
}