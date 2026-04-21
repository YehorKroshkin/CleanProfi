import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, type UserProfile } from '../api/auth'

type Translation = {
  profile: string
  userInfo: string
  logout: string
  userName: string
  userCity: string
  userDistrict: string
  userStreet: string
  userPhone: string
  login: string
  password: string
  confirmPassword: string
  currentPassword: string
  newPassword: string
  savePassword: string
  passwordChanged: string
  passwordHint: string
  passwordMismatch: string
}

type ProfilePageProps = {
  user: UserProfile | null
  labels: Translation
  onLogout: () => void | Promise<void>
}

export function ProfilePage({ user, labels, onLogout }: ProfilePageProps) {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [successText, setSuccessText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return (
      <section className="profile-page">
        <div className="info-card">
          <h2>{labels.profile}</h2>
          <p>
            <Link to="/auth">{labels.login}</Link>
          </p>
        </div>
      </section>
    )
  }

  async function handleLogoutClick() {
    await onLogout()
    navigate('/')
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorText('')
    setSuccessText('')

    if (newPassword !== confirmPassword) {
      setErrorText(labels.passwordMismatch)
      return
    }

    if (newPassword.length < 10) {
      setErrorText(labels.passwordHint)
      return
    }

    try {
      setIsLoading(true)
      const result = await changePassword({
        currentPassword,
        newPassword,
      })
      setSuccessText(result.message || labels.passwordChanged)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      setErrorText(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="profile-page">
      <div className="info-card">
        <h2>{labels.profile}</h2>
        <p>{labels.userInfo}</p>

        <div className="profile-list">
          <div className="profile-row">
            <strong>{labels.userName}</strong>
            <p>{user.name}</p>
          </div>
          <div className="profile-row">
            <strong>{labels.login}</strong>
            <p>{user.email}</p>
          </div>
          <div className="profile-row">
            <strong>{labels.userCity}</strong>
            <p>{user.city}</p>
          </div>
          <div className="profile-row">
            <strong>{labels.userDistrict}</strong>
            <p>{user.district}</p>
          </div>
          <div className="profile-row">
            <strong>{labels.userStreet}</strong>
            <p>{user.street}</p>
          </div>
          <div className="profile-row">
            <strong>{labels.userPhone}</strong>
            <p>{user.phone}</p>
          </div>
        </div>

        <button type="button" className="primary-btn profile-logout" onClick={() => void handleLogoutClick()}>
          {labels.logout}
        </button>
      </div>

      <div className="auth-card">
        <h2>{labels.savePassword}</h2>
        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <label>
            {labels.currentPassword}
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>

          <label>
            {labels.newPassword}
            <input
              type="password"
              minLength={10}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>

          <label>
            {labels.confirmPassword}
            <input
              type="password"
              minLength={10}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {errorText ? <p className="auth-error">{errorText}</p> : null}
          {successText ? <p className="auth-success">{successText}</p> : null}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {labels.savePassword}
          </button>
        </form>
      </div>
    </section>
  )
}
