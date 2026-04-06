import RehearsalClient from "./RehearsalClient";

export function generateStaticParams() {
    return [{ roomId: "demo-room-123" }];
}

export default function RehearsalPage(props: { params: Promise<{ roomId: string }> }) {
    return <RehearsalClient params={props.params} />;
}
