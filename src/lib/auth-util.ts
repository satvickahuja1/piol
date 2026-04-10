import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"



const requireAuth = async ()=>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session){
        redirect('/login')
    }
    return session
}
const noAuth = async ()=>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(session){
        redirect('/')
    }
    return session
}
export {requireAuth,noAuth}