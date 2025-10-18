import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            "https://maestro-api-dev.secil.biz/Auth/Login",
            {
              username: credentials?.username,
              password: credentials?.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": "YOUR_SECRET_TOKEN", 
              },
            }
          );

          const apiData = response.data?.data || response.data;

          if (apiData?.accessToken) {
            return {
              id: apiData.accessToken,
              accessToken: apiData.accessToken,
              refreshToken: apiData.refreshToken,
            };
          }

          console.error("Access token alınamadı:", apiData);
          return null;
        } catch (err) {
          console.error("Login error:", err);
          throw new Error("Giriş başarısız. Bilgileri kontrol edin.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
