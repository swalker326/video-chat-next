import UserList from "./_components/UserList";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const users = await serverClient.getUsers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Home</h1>
      <UserList initialData={users} />
    </main>
  );
}
