import InputClient from "./InputClient";

export function generateStaticParams() {
    return [{ roomId: "demo-room-123" }];
}

export default function InputPage(props: { params: Promise<{ roomId: string }> }) {
    return <InputClient params={props.params} />;
}
