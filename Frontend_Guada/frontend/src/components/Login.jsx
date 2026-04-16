// src/components/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import kyoImg from '../assets/Kyocera_logo.svg.png'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRegister) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          confirmButtonColor: 'var(--kyocera-red)'
        })
        return
      }

      Swal.fire({
        icon: 'success',
        title: 'Registro completado',
        confirmButtonColor: 'var(--kyocera-red)'
      }).then(() => setIsRegister(false))

    } else {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola ${name}👋`,
        confirmButtonColor: 'var(--kyocera-red)'
      }).then(() => navigate('/'))
    }

    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="login-page">

      {/* HEADER LOGIN */}
      <div className="login-header">
        <img src={kyoImg} alt="Kyocera Logo" />
        <h1>Gestión de Incidencias</h1>
      </div>

      {/* FORM */}
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">

          {isRegister && (
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Iniciar sesión' : 'Regístrate'}
          </button>
        </p>
      </div>

    </div>
  )
}