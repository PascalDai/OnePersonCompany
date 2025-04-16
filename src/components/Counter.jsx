import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow-md">
      <p className="text-lg font-medium mb-2">计数器: <span className="text-blue-600">{count}</span></p>
      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          增加
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => setCount(0)}
        >
          重置
        </button>
      </div>
    </div>
  );
} 