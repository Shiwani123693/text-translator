import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Translator from './pages/Translator';
import StringGenerator from './pages/StringGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/generator" element={<StringGenerator />} />
        </Routes>
      </main>
    </div>
  );
}