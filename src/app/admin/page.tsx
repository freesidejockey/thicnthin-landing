import { ProfilesTable } from './ProfilesTable'
import { GroupsTable } from './GroupsTable'
import { ReportGenerationSection } from './ReportGenerationSection'

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <ProfilesTable />
      <GroupsTable />
      <ReportGenerationSection />
    </div>
  )
}
