

import  LoginForm  from "@/features/auth/components/login"
import { noAuth } from "@/lib/auth-util"
import Image from "next/image"
import Link from "next/link"


const page = async () =>{
    await noAuth()
    return <>

    <LoginForm/>
    </>
}

export default page