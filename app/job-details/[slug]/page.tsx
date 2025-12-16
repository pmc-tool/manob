import JobDetailsPage from "@/components/pmc-migrated/job-details/JobDetailsPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <JobDetailsPage slug={slug} />;
}
