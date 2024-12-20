import axios from 'axios'

const API_BASEURL = import.meta.env.VITE_API_BASEURL

const requestInstance = axios.create({
  baseURL: API_BASEURL,
  timeout: 300000
})

export default requestInstance
