import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import kyoImg from '../assets/Kyocera_logo.svg.png'
import { login, register } from '../services/auth-service'
import { getValidToken } from '../services/api-config' 

export default function Login({ setToken }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => { // Añadimos async para poder usar await
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

      try {
        // Llamada real al registro del backend
        await register(email, password); 
        
        Swal.fire({
          icon: 'success',
          title: 'Registro completado',
          text: 'Ahora puedes iniciar sesión',
          confirmButtonColor: 'var(--kyocera-red)'
        }).then(() => setIsRegister(false))
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: err.message,
          confirmButtonColor: 'var(--kyocera-red)'
        })
      }

    } else {
      try {
        // --- CONEXIÓN CON EL BACKEND ---
        // Pasamos 'email' como identificador del usuario
        await login(email, password); 

        // Actualizar el estado en App.jsx con el token validado
        setToken(getValidToken())

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada correctamente`,
          confirmButtonColor: 'var(--kyocera-red)'
        }).then(() => navigate('/'))

      } catch (err) {
        // Si el backend devuelve 401 o error de red, caerá aquí
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Usuario o contraseña incorrectos',
          confirmButtonColor: 'var(--kyocera-red)'
        })
      }
    }

    // Limpiamos los campos
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="login-page">
      <div className="login-header">
        <img src={kyoImg} alt="Kyocera Logo" />
        <h1>Gestión de Incidencias</h1>
      </div>

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