import PartnerAClient from "./PartnerAClient";

export function generateStaticParams() {
  return [{ roomId: "demo-room-123" }];
}

export default function PartnerAPage(props: { params: Promise<{ roomId: string }> }) {
  return <PartnerAClient params={props.params} />;
}
