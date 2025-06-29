export class APIError<TDetail> extends Error {
  status: number
  details?: TDetail

  constructor(
    public message: string,
    options?: {
      status?: number
      details?: TDetail
    },
  ) {
    super(message)

    this.name = 'APIError'
    this.status = options?.status || 500
    this.details = options?.details
    this.message = message

    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    }
  }
}
