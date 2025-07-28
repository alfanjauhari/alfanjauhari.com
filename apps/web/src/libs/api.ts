import { APIError } from 'payload'

export async function fetchAPI<T>(
  url: URL | string,
  { credentials, ...options }: RequestInit = {},
): Promise<T> {
  const props: RequestInit = {
    credentials: credentials || 'include',
    ...options,
  }

  const response = await fetch(
    `${process.env.PUBLIC_PAYLOAD_API_URL}${url}`,
    props,
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new APIError('API request failed', response.status, errorData)
  }

  return response.json() as Promise<T>
}
