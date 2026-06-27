import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl fs-2 font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Lingofy
        </h1>
        <div className="flex space-x-4">
          <NavLink to="/" className={linkClass}>Translator</NavLink>
          <NavLink to="/generator" className={linkClass}>String Gen</NavLink>
        </div>
      </div>
    </nav>
  );
}