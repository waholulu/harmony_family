import PartnerBClient from "./PartnerBClient";

export function generateStaticParams() {
  return [{ roomId: "demo-room-123" }];
}

export default function PartnerBPage(props: { params: Promise<{ roomId: string }> }) {
  return <PartnerBClient params={props.params} />;
}
