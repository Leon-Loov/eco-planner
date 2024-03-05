import Login from "@/components/forms/userInfo/login";

export default async function Page() {
  return (
    <>
      <main className="container margin-auto padding-y-500 flex gap-300 align-items-center">
        <Login />
      </main>
    </>
  )
}