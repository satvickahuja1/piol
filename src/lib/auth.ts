import 'dotenv/config'
import  { checkout , polar , portal, usage } from '@polar-sh/better-auth'
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle";
import * as schema from '../drizzle/schema'
import { polarClient } from './polar';



export const auth = betterAuth(
    {
        database: drizzleAdapter(db, {
            provider: "pg",
            schema
        }),
        emailAndPassword: {
            enabled: true,
            autoSignIn : true
        },
        plugins : [
            polar({
                client : polarClient,
                createCustomerOnSignUp : true,
                use : [
                    checkout ({
                        products: [
                            {
                                productId : 'ad3fa216-de33-4586-ba08-508ea057df7f',
                                slug :'pro'
                            },
                        ],
                        successUrl : process.env.POLAR_SUCCESS_URL,
                        authenticatedUsersOnly : true
                    }),
                    portal(),
                    usage()
                ],
                
            })
        ]
    }
);