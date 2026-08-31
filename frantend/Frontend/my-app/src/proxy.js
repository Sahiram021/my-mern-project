import { NextResponse } from "next/server";

const protectedRoutes=[
    "/my-dashboard",
    "/change-password",
    "/checkout",
    "/wishlist",
    "/cart"
] 

export function proxy(req){
    const token =req.cookies.get("token")?.value
    const { pathname }=req.nextUrl

    const isProtected = protectedRoutes.some((route)=>
    pathname.startsWith(route)
)
if(isProtected && !token){
    const loginUrl = new URL ("/login-register",req.url)
    return NextResponse.redirect(loginUrl)
}
return NextResponse.next()
}