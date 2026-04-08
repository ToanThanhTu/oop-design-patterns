const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function request<T, K>(path: string, method: string, body?: T): Promise<K | void> {
  let response
  
  if (body) {
    response = await fetch(`${baseApiUrl}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } else {
    response = await fetch(`${baseApiUrl}${path}`, {
      method: method,
    })
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Request failed')
  }

  if (response.status === 204) {
    return
  }

  const result: K = await response.json()

  return result
}

export async function get<K>(path: string) {
  const result = await request<never, K>(path, 'GET')
  return result
}

export async function post<T, K>(path: string, body: T) {
  const result = await request<T, K>(path, 'POST', body)
  return result
}

export async function put<T, K>(path: string, body: T) {
  const result = await request<T, K>(path, 'PUT', body)
  return result
}

export async function del(path: string) {
  const result = await request(path, 'DELETE')
  return result
}