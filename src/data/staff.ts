import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createSessionClient } from '@/lib/supabase/server'

export type StaffRole = 'writer' | 'editor'

export interface CurrentStaff {
  userId: string
  email: string | null
  role: StaffRole
  authorId: number | null
}

// A signed-in user with no row in `staff` is NOT staff: they get no access.
export const getCurrentStaff = cache(async (): Promise<CurrentStaff | null> => {
  const supabase = await createSessionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('staff')
    .select('role, author_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!data) return null

  return { userId: user.id, email: user.email ?? null, role: data.role, authorId: data.author_id }
})

// Call at the top of every admin page AND every server action: proxy.ts is only the first gate.
export async function requireStaff(role?: StaffRole): Promise<CurrentStaff> {
  const staff = await getCurrentStaff()
  if (!staff) redirect('/admin/login?error=' + encodeURIComponent('Your account is not set up as staff.'))
  if (role && staff.role !== role) redirect('/admin')
  return staff
}
