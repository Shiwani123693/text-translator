import { useState, useCallback, useEffect } from 'react';

export default function StringGenerator() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedString, setGeneratedString] = useState('');

  // useCallback memoizes the logic to ensure the function reference remains constant unless state changes
  const generateString = useCallback(() => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    setGeneratedString(result);
  }, [length, includeNumbers, includeSymbols]);

  // useEffect runs automatically upon initial component mount and whenever 'generateString' updates
  useEffect(() => {
    generateString();
  }, [generateString]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">⚡ Random String Generator</h2>

      <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mb-6 flex justify-between items-center break-all">
        <span className="font-mono text-xl text-emerald-400">{generatedString}</span>
        <button 
          onClick={generateString}
          className="ml-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 p-2 rounded-lg text-sm font-medium transition"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-400">Length: {length}</label>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-cyan-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-300">Include Numbers</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-300">Include Symbols</span>
          </label>
        </div>
      </div>
    </div>
  );
}