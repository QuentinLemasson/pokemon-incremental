import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-slate-600 rounded bg-slate-800 text-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-slate-600 rounded bg-slate-800 text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};
