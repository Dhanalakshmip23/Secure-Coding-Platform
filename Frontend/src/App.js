import React, { useState } from 'react';
import Editor from './Editor';
import axios from 'axios';

function App() {
  const [output, setOutput] = useState('');
  const [files, setFiles] = useState([]);
  const [plagiarism, setPlagiarism] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const API = "http://localhost:5000";

  const executeCode = async (code) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/execute`, {
        code: `${code}`,
        language
      });
      setOutput(res.data.output || 'No output');
    } catch (err) {
      setOutput(err.response?.data?.output || err.message || 'Execution failed');
    }
    setLoading(false);
  };

  const checkPlagiarism = async (selectedFiles) => {
    if (selectedFiles.length < 1) {
      alert('Upload at least 1 file to check plagiarism');
      return;
    }

    setLoading(true);
    console.log("Plagiarism check running for files:", selectedFiles);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const res = await axios.post(`${API}/plagiarism`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPlagiarism(res.data);
      console.log("Plagiarism response:", res.data);
    } catch (err) {
      console.error('Plagiarism check failed:', err);
      setPlagiarism({ plagiarismFound: false, matches: [] });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Secure Coding Platform
        </h1>
        <p className="text-gray-400">Code • Execute • Detect Plagiarism</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Editor onRun={executeCode} />

        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            📤 Output
            {loading && (
              <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>

          <div className="bg-black/50 p-6 rounded-xl font-mono text-sm overflow-auto h-96 border border-gray-600">
            {output || 'Run your code to see output here...'}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">🔍 Plagiarism Detection</h2>

          <div className="flex gap-4 flex-wrap">
            <input
              type="file"
              multiple
              accept=".js,.py,.c,.java,.txt,text/plain"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="flex-1 
              file:mr-4 file:py-3 file:px-6 
              file:rounded-xl file:border-0 
              file:text-sm file:font-semibold 
              file:bg-gradient-to-r file:from-red-500 file:to-red-600 
              file:text-white hover:file:from-red-600 hover:file:to-red-700 
              transition-all"
            />

            <button
              onClick={() => checkPlagiarism(files)}
              disabled={files.length < 1 || loading}
              className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              Check Plagiarism
            </button>
          </div>

          {plagiarism && (
            <div
              className={`mt-6 p-4 rounded-xl border-2 transition-all ${
                plagiarism.plagiarismFound
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-green-500 bg-green-500/10'
              }`}
            >
              <h3 className="font-semibold mb-3">
                {plagiarism.plagiarismFound
                  ? '⚠️ Plagiarism Detected!'
                  : '✅ No Plagiarism Found'}
              </h3>

              {plagiarism.plagiarismFound && plagiarism.matches?.length > 0 && (
                <div className="space-y-2">
                  {plagiarism.matches.map((match, i) => (
                    <div key={i} className="p-3 bg-red-500/20 rounded-lg border border-red-500/50">
                      {match.file1} vs {match.file2}:{' '}
                      <span className="font-bold text-red-400">
                        {match.similarity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;