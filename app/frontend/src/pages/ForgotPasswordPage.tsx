import React, { useState } from "react"
import { Link } from "react-router-dom"
import { requestPasswordReset } from "../actions/auth"
import CSRFToken from "../components/CSRFToken"

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const success = await requestPasswordReset(email)
        if (success) setSubmitted(true)
    }

    return (
        <div className="w-full md:max-w-[48rem] mx-auto mt-20 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-[2.4rem] font-semibold text-center mb-6">
                    Forgot Password
                </h1>

                {submitted ? (
                    <p className="text-center text-[1.4rem] text-gray-600">
                        If an account exists for that email, a password reset
                        link has been sent.
                    </p>
                ) : (
                    <form
                        onSubmit={onSubmit}
                        className="text-center"
                    >
                        <CSRFToken />
                        <div className="mb-6">
                            <label
                                className={labelClass}
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className={inputClass}
                                id="email"
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <button
                            className="w-full py-2.5 bg-brand text-white rounded-lg
                                    hover:bg-brand-dark transition-colors font-semibold mb-[1rem]"
                            type="submit"
                        >
                            Send Reset Link
                        </button>
                        Don't forget to check your spam folder!
                    </form>
                )}

                <p className="mt-4 text-center text-[1.4rem] text-gray-600">
                    <Link
                        className="text-brand hover:underline"
                        to="/login"
                    >
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
