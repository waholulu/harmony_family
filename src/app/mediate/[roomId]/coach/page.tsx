import CoachClient from "./CoachClient";

export function generateStaticParams() {
  return [{ roomId: "demo-room-123" }];
}

export default function CoachPage(props: { params: Promise<{ roomId: string }> }) {
  return <CoachClient params={props.params} />;
}
