// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import api from '@/utils/api'

export const authOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // 백엔드 API 호출하여 사용자 정보 저장/조회
        const response = await api.post('/user-service/social-login', {
          socialId: account.providerAccountId,
          provider: account.provider,
          email: user.email
        });
        
        // 응답에서 필요한 정보 저장
        user.uuid = response.data.uuid;
        user.accessToken = response.data.accessToken;
        return true;
      } catch (error) {
        console.error('소셜 로그인 에러:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.uuid = user.uuid;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.uuid = token.uuid;
      session.user.accessToken = token.accessToken;
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }