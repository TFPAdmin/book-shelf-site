
import React, { useState, useEffect } from 'react'

const API_BASE = 'https://book-shelf-site.alyeska.workers.dev'

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ title: '', subtitle: '', excerpt: '', cover: '', wattpad: '' })

  useEffect(() => {
    if (token) fetchBooks()
  }, [token])

  async function fetchBooks() {
    const res = await fetch(`${API_BASE}/books`)
    const data = await res.json()
    setBooks(data)
  }

  async function saveBook() {
    await fetch(`${API_BASE}/admin/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    fetchBooks()
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return token ? (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-2 font-bold">Add a Book</h2>
      {['title', 'subtitle', 'excerpt', 'cover', 'wattpad'].map(f => (
        <input
          key={f}
          name={f}
          value={form[f]}
          onChange={handleChange}
          placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          className="block border border-gray-300 p-2 mb-2 w-full rounded"
        />
      ))}
      <button
        onClick={saveBook}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>

      <h2 className="text-xl mt-6 font-semibold">Books</h2>
      <ul className="mt-2 space-y-1">
        {books.map(book => (
          <li key={book.id} className="border-b pb-1">
            <strong>{book.title}</strong> — <em>{book.subtitle}</em>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <LoginForm setToken={setToken} />
  )
}

function LoginForm({ setToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } else {
      alert('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4 font-bold">Admin Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="block mb-2 border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="block mb-4 border p-2 w-full rounded"
      />
      <button
        onClick={login}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Login
      </button>
    </div>
  )
}
