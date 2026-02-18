import authOptions from "@/lib/auth";
import NextAuth from "next-auth"

// Prevent Next.js from statically rendering this route at build time
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }