import Detail from "../../../components/features/propertyDetails";

import type { Metadata } from "next";
import { getProperty } from "../../../lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  return {
    title: `${property.title} | Solomon Multi-Link`,
    description: `View details for ${property.title} available for sale in ${property.location} at ${property.price}. ${property.description}`,
  };
}

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <Detail params={params} />;
}
