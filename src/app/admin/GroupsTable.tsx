import { Suspense } from 'react'
import { loadGroups } from './actions'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

async function GroupsData() {
  const groups = await loadGroups()

  return (
    <Table className="min-w-[800px]">
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 uppercase">Name</TableHead>
          <TableHead className="px-6 uppercase">Description</TableHead>
          <TableHead className="px-6 uppercase">Status</TableHead>
          <TableHead className="px-6 uppercase">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell className="whitespace-nowrap px-6 font-medium">
              {group.name}
            </TableCell>
            <TableCell className="px-6">{group.description}</TableCell>
            <TableCell className="whitespace-nowrap px-6">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  group.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {group.is_active ? 'Active' : 'Inactive'}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap px-6">
              {new Date(group.created_at).toLocaleDateString()}
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
      <div className="min-w-[800px] rounded-lg border p-4">
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

export function GroupsTable() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Groups</h2>
      <Suspense fallback={<TableSkeleton />}>
        <GroupsData />
      </Suspense>
    </section>
  )
}
