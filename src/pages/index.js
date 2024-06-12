import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>Hello</div>
      <Link href="/verify">
        Verify
      </Link>
    </div>
  );
}
