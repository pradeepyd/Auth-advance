import { auth } from "@/auth";

const settingPage = async () => {
  const session = await auth();

  return <div>{JSON.stringify(session)}</div>;
};
export default settingPage;
