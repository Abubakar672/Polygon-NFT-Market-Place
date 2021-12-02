import { useRouter } from "next/router";
import { useEffect } from "react";
import User from "../../../components/User";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/user/${router.query.userSlug}/created`);
  });

  return (
    <>
      <User />
    </>
  );
}
