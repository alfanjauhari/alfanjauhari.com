import { APIError } from './errors'

export async function fetchAPI<T>(
  url: URL | string,
  { credentials, ...options }: RequestInit = {},
): Promise<T> {
  const props: RequestInit = {
    credentials: credentials || 'include',
    ...options,
  }

  const response = await fetch(
    `${import.meta.env.PUBLIC_PAYLOAD_API_URL}${url}`,
    props,
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new APIError('API request failed', {
      status: response.status,
      details: errorData,
    })
  }

  return response.json() as Promise<T>
}
