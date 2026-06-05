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

const signupSchema = z.object({
    email: z.email('please enter valid email'),
    password: z.string('please enter valid password').min(8, "Password length must be 8 minimum"),
    name: z.string('please enter valid name').min(4, "name can't e less than 4")
})

type signupFormSchema = z.infer<typeof signupSchema>

export default function SignupForm() {
    const router = useRouter()
    const formp = useForm<signupFormSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    })
    const onsubmit = async (values: signupFormSchema) => {
        const res = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name
        })
        if(res.data){
            router.push('/')
        }else{
            toast(`${res.error.message}`)
        }
        formp.reset({ email: '', password: "" })
    }
    const ispending = formp.formState.isSubmitting
    return (
        <div className=' px-7 flex flex-col justify-center w-full items-center gap-6'>
            <Card className='p-5 w-full max-w-2xl'>
                <CardHeader className='text-center'>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Let's create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className=' w-full' onSubmit={formp.handleSubmit(onsubmit)} {...formp}>
                        <div className='flex flex-col gap-6 '>
                            <Button variant={'outline'} className='w-full ' type='button' disabled={ispending}>
                               <Image src={'/logos/github.svg'} alt='github' height={20} width={20} /> Continue with Github
                            </Button>
                            <Button  variant={'outline'} className='w-full ' type='button' disabled={ispending}>
                              <Image src={'/logos/google.svg'} alt='github' height={20} width={20} />  Continue with Google
                            </Button>
                            <div className='flex flex-col gap-1'>
                                <h1>Enter name</h1>
                                <Input {...formp.register('name')} placeholder='shivam ahuja' />
                                {formp.formState.errors.name && <p className=' text-red-500'>{formp.formState.errors.name.message}</p>}
                            </div>
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
                            <Button>Sign UP</Button>
                            <div className='text-center text-sm'>
                                Already have an account? {"  "}
                                <Link className='underline underline-offset-4' href={'/login'}>
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}