import { requireAuth } from "@/lib/auth-util"
import { caller } from "@/trpc/server"



const page = async () => {
  await requireAuth()
 const res = await caller.lover()
 console.log(res)
  return (
    <div>

    </div>
  )
}

export default page