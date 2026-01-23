import { Link } from 'react-router-dom';

export const MapGenPage = () => {
  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="mb-6">
        <Link
          to="/game"
          className="text-sm text-slate-400 hover:text-slate-300"
        >
          ← Back to game
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Map Generator</h1>
      <div className="flex-1">
        <p className="text-slate-400">
          Map generation tools and settings will be available here.
        </p>
      </div>
    </div>
  );
};
