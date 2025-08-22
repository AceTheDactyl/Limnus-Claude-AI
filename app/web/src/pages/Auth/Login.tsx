import React from 'react'
import { LogIn } from 'lucide-react'

function Login() {
  const handleLogin = () => {
    // This would integrate with Cognito Hosted UI
    console.log('Redirecting to Cognito login...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Community Consciousness</h1>
          <p className="text-gray-600 mt-2">Access your consciousness network</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In with SSO</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Secure authentication powered by AWS Cognito
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>New to the platform?</p>
            <p className="mt-1">Contact your administrator for access.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login