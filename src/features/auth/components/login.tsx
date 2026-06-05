'use client'
import { Button } from '@/components/ui/button'
import { CardAction, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.email('please enter valid email'),
    password: z.string('please enter valid password').min(8, "Password length must be 8 minimum")
})

type loginFormSchema = z.infer<typeof loginSchema>

export default function LoginForm() {
    const router = useRouter()
    const formp = useForm<loginFormSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const onsubmit = async (values: loginFormSchema) => {
        const res = await authClient.signIn.email({
            email: values.email,
            password: values.password
        })
        console.log( res)
        if(res.data){
            router.push('/')
        }else{
            toast(`${res.error.message}`)
        }
        formp.reset({ email: '', password: "" })
    }
    const ispending = formp.formState.isSubmitting
    return (
        <div className=' px-7 w-full flex flex-col justify-center items-center gap-6'>
            <Card className='p-5 w-full max-w-2xl'>
                <CardHeader className='text-center'>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className=' w-full' onSubmit={formp.handleSubmit(onsubmit)} {...formp}>
                        <div className='flex flex-col gap-6 '>
                            <Button variant={'outline'} className='w-full ' type='button' disabled={ispending}>
                                Continue with Github
                            </Button>
                            <Button variant={'outline'} className='w-full ' type='button' disabled={ispending}>
                                Continue with Google
                            </Button>
                            <div className='flex flex-col gap-1'>
                                <h1>Enter email</h1>
                                <Input {...formp.register('email')} placeholder='m@gmail.com' />
                                {formp.formState.errors.email && <p className='text-red-500'>{formp.formState.errors.email.message}</p>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1>Enter Password</h1>
                                <Input {...formp.register('password')} placeholder='enter password' />
                                {formp.formState.errors.password && <p className=' text-red-500'>{formp.formState.errors.password.message}</p>}
                            </div>
                            <Button>Log in</Button>
                            <div className='text-center text-sm'>
                                Don't have an account? {"  "}
                                <Link className='underline underline-offset-4' href={'/signup'}>
                                Signup
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}