"use client";
//30min

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isSignin ? "Welcome Back 👋" : "Create an Account ✨"}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          {/* Submit Button */}
          <button
            onClick={() => {
              // Add auth logic here
            }}
            className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>

        {/* Switch link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            {isSignin ? "Sign Up" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}
