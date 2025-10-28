import { Suspense } from 'react'
import { loadProfiles } from './actions'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

async function ProfilesData() {
  const profiles = await loadProfiles()

  return (
    <Table className="min-w-[1200px]">
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 uppercase">Code</TableHead>
          <TableHead className="px-6 uppercase">Name</TableHead>
          <TableHead className="px-6 uppercase">Email</TableHead>
          <TableHead className="px-6 uppercase">Phone</TableHead>
          <TableHead className="px-6 uppercase">Current Weight</TableHead>
          <TableHead className="px-6 uppercase">Goal Weight</TableHead>
          <TableHead className="px-6 uppercase">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell className="whitespace-nowrap px-6 font-medium">
              {profile.profile_code}
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {profile.first_name} {profile.last_name}
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {profile.email}
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {profile.phone}
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {profile.current_weight} lbs
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {profile.goal_weight} lbs
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {new Date(profile.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] rounded-lg border p-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export function ProfilesTable() {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-semibold">Profiles</h2>
      <Suspense fallback={<TableSkeleton />}>
        <ProfilesData />
      </Suspense>
    </section>
  )
}
