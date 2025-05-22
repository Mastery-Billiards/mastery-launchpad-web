import axios from 'axios'

export const client = axios.create({
  baseURL: process.env.HOST,
  headers: {
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
  },
})

export const baseUrl = () => `${process.env.HOST}/api/v1/mastery`
export const baseAuthUrl = () => `${process.env.HOST}/api/v1/auth`
