import { Navigate, useParams } from "react-router-dom";
import { getTierCluster, type TierSubpage } from "@/config/awards/tierCluster";
import { TierClusterLayout } from "@/components/awards/cluster/TierClusterLayout";
import {
  TierAboutSection,
  TierCriteriaSection,
  TierNomineesSection,
  TierNominateSection,
} from "@/components/awards/cluster/sections";

type Sub = Exclude<TierSubpage, "overview">;

const RENDERERS: Record<Sub, (props: { tier: ReturnType<typeof getTierCluster> }) => JSX.Element> = {
  about: ({ tier }) => <TierAboutSection tier={tier!} />,
  criteria: ({ tier }) => <TierCriteriaSection tier={tier!} />,
  nominees: ({ tier }) => <TierNomineesSection tier={tier!} />,
  nominate: ({ tier }) => <TierNominateSection tier={tier!} />,
};

interface Props {
  subpage: Sub;
}

export default function TierClusterPage({ subpage }: Props) {
  const { tier: tierSlug } = useParams<{ tier: string }>();
  const tier = getTierCluster(tierSlug);

  if (!tier) return <Navigate to="/awards" replace />;

  const Renderer = RENDERERS[subpage];
  return (
    <TierClusterLayout tier={tier} subpage={subpage}>
      <Renderer tier={tier} />
    </TierClusterLayout>
  );
}
