import ResultClient from "./ResultClient";

export function generateStaticParams() {
  return [{ roomId: "demo-room-123" }];
}

export default function ResultPage(props: { params: Promise<{ roomId: string }> }) {
  return <ResultClient params={props.params} />;
}
