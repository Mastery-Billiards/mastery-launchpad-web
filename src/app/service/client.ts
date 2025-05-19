import axios from 'axios'

export const client = axios.create({
  baseURL: 'http://103.90.226.218:8080/',
  headers: {
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
  },
})

export const baseUrl = () => `http://103.90.226.218:8080/api/v1/mastery`
