import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const inputClass =
  'w-full rounded-full border border-slate-300 px-5 py-3 text-sm text-[#0a1428] placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition'

function SignUpModal({ open, onClose, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Sign up submitted:', { name, email, password })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xl font-['DM_Sans',sans-serif]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          ✕
        </button>

        <h2
          id="signup-title"
          className="text-center font-['Playfair_Display',serif] text-3xl font-bold text-[#0a1428]"
        >
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-blue-600 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}

export default SignUpModal
