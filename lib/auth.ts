import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
)

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(formData: FormData) {
  // Simulate API call to validate credentials
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const token = await encrypt({
    id: '1',
    email: formData.get('email'),
  })
  
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })
  
  return { success: true }
}

export async function logout() {
  cookies().delete('token')
  return { success: true }
}

export async function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  try {
    return await decrypt(token)
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  try {
    const parsed = await decrypt(token)
    // Refresh token if it's close to expiring
    const newToken = await encrypt(parsed)
    request.cookies.set('token', newToken)
  } catch {
    request.cookies.delete('token')
  }
}

