import React, { useState } from "react";

export default function Editor({ onRun }) {
  const [code, setCode] = useState("");

  return (
    <div className="p-4">
      <textarea
        className="w-full h-64 p-3 border rounded bg-gray-900 text-white font-mono"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => onRun && onRun(code)}
      >
        Run Code
      </button>
    </div>
  );
}
