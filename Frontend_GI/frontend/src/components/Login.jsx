// src/components/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

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
          title: 'Oops...',
          text: 'Las contraseñas no coinciden',
          confirmButtonColor: 'var(--kyocera-red)'
        })
        return
      }

      console.log('Registro:', { name, email, password })

      Swal.fire({
        icon: 'success',
        title: '¡Registro completado con éxito!',
        confirmButtonColor: 'var(--btn-confirm-sweetAlert)'
      }).then(() => {
        setIsRegister(false)
      })

    } else {
      console.log('Login:', { email, password })

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenid@!',
        text: `Hola ${name} 👋`,
        confirmButtonColor: 'var(--btn-confirm-sweetAlert)'
      }).then(() => {
        navigate('/')
      })
    }

    // limpiar campos
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px'
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'left' }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        {isRegister && (
          <div>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {isRegister && (
          <div>
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRegister ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          style={{
            color: '#007bff',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {isRegister ? 'Iniciar sesión' : 'Regístrate'}
        </button>
      </p>
    </div>
  )
}