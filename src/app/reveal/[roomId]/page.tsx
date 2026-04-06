import RevealClient from "./RevealClient";

export function generateStaticParams() {
    return [{ roomId: "demo-room-123" }];
}

export default function RevealPage(props: { params: Promise<{ roomId: string }> }) {
    return <RevealClient params={props.params} />;
}
