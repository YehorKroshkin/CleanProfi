import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, type UserProfile } from '../api/auth'

type Translation = {
  authTitle: string
  authSubtitle: string
  name: string
  city: string
  district: string
  street: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  signIn: string
  signUp: string
  passwordMismatch: string
  passwordHint: string
  authSuccess: string
  registerSuccess: string
}

type AuthPageProps = {
  labels: Translation
  onAuthSuccess: (user: UserProfile) => void
}

export function AuthPage({ labels, onAuthSuccess }: AuthPageProps) {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [street, setStreet] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [successText, setSuccessText] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorText('')
    setSuccessText('')

    if (isRegister) {
      if (password !== confirmPassword) {
        setErrorText(labels.passwordMismatch)
        return
      }

      if (password.length < 10) {
        setErrorText(labels.passwordHint)
        return
      }
    }

    try {
      setIsLoading(true)

      if (isRegister) {
        await registerUser({
          name,
          city,
          district,
          street,
          phone,
          email,
          password,
        })
        setSuccessText(labels.registerSuccess)
        setIsRegister(false)
        setPassword('')
        setConfirmPassword('')
        navigate('/auth')
      } else {
        const result = await loginUser({ email, password })
        onAuthSuccess(result.user)
        setSuccessText(labels.authSuccess)
        setPassword('')
        setConfirmPassword('')
        navigate('/')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      setErrorText(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>{labels.authTitle}</h1>
        <p>{labels.authSubtitle}</p>

        <div className="auth-switch" role="group" aria-label="Auth mode">
          <button
            type="button"
            className={!isRegister ? 'mode-btn active' : 'mode-btn'}
            onClick={() => {
              setIsRegister(false)
              setErrorText('')
              setSuccessText('')
            }}
          >
            {labels.signIn}
          </button>
          <button
            type="button"
            className={isRegister ? 'mode-btn active' : 'mode-btn'}
            onClick={() => {
              setIsRegister(true)
              setErrorText('')
              setSuccessText('')
            }}
          >
            {labels.signUp}
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister ? (
            <>
              <label>
                {labels.name}
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label>
                {labels.city}
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </label>
              <label>
                {labels.district}
                <input
                  type="text"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  required
                />
              </label>
              <label>
                {labels.street}
                <input
                  type="text"
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                  required
                />
              </label>
              <label>
                {labels.phone}
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </label>
            </>
          ) : null}

          <label>
            {labels.email}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            {labels.password}
            <input
              type="password"
              value={password}
              minLength={10}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {isRegister ? (
            <label>
              {labels.confirmPassword}
              <input
                type="password"
                value={confirmPassword}
                minLength={10}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>
          ) : null}

          {errorText ? <p className="auth-error">{errorText}</p> : null}
          {successText ? <p className="auth-success">{successText}</p> : null}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isRegister ? labels.signUp : labels.signIn}
          </button>
        </form>
      </div>
    </section>
  )
}
