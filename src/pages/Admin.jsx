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
      {['title', 'subtitle', 'exc]()
