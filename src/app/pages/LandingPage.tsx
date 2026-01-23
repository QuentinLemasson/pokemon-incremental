import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Pokemon RPG</h1>
      <p className="text-lg text-slate-400 mb-8">
        Welcome to the Pokemon RPG incremental game
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Register
        </Link>
        <Link
          to="/game"
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Play Game
        </Link>
      </div>
    </div>
  );
};
