import axios, { AxiosInstance } from 'axios'

let _axios: AxiosInstance
export const getAxiosInstance = () => _axios
export const initializeAxiosInstance = async (
  commentoOrigin: string,
  commenterToken: string,
  domain: string,
  auth0Token: string
) => {
  _axios = axios.create({
    baseURL: commentoOrigin,
    headers: {
      Authorization: `Bearer ${auth0Token}`
    },
    data: {
      commenterToken,
      domain
    }
  })
}
