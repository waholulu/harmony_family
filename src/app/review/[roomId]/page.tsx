import ReviewClient from "./ReviewClient";

export function generateStaticParams() {
    return [{ roomId: "demo-room-123" }];
}

export default function ReviewPage(props: { params: Promise<{ roomId: string }> }) {
    return <ReviewClient params={props.params} />;
}
