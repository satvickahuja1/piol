import SignupForm from "@/features/auth/components/register-form"
import { noAuth } from "@/lib/auth-util"

const page = async ()=>{

    await noAuth()

 return(
    <>
        <SignupForm/>
    </>
 )
}

export default page