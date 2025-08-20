import { sleep } from 'k6'
import http from 'k6/http'

export const options = {
  vus: 100,
  duration: '30s',
  cloud: {
    projectID: 3792139,
    name: 'Test (06/08/2025)',
  },
}

export default function () {
  http.get('https://alfanjauhari.com')

  sleep(1)
}
