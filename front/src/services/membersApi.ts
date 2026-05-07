import api from './api'
import type { Member, CreateMemberInput, UpdateMemberInput } from '../types'

export async function listMembers(): Promise<Member[]> {
  const { data } = await api.get<Member[]>('/members')
  return data
}

export async function createMember(input: CreateMemberInput): Promise<Member> {
  const { data } = await api.post<Member>('/members', input)
  return data
}

export async function updateMember(id: number, input: UpdateMemberInput): Promise<Member> {
  const { data } = await api.patch<Member>(`/members/${id}`, input)
  return data
}
