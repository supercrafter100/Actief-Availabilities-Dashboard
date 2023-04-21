import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Role } from "types"
import { Login } from "../validations"
import ActiefAPI from "integrations/ActiefInterim/ActiefAPI"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const cookies = await ActiefAPI.login(email, password)

  if (!cookies) {
    throw new AuthenticationError()
  }

  const { code, code_verifier } = await ActiefAPI.AuthorizeClient(cookies)
  const { access, refresh } = await ActiefAPI.getAccessToken(cookies, code, code_verifier)
  const user = await ActiefAPI.getCurrentUser(access)

  // Get user by email
  let dbUser = await db.user.findFirst({ where: { sub: user.sub } })
  if (!dbUser) {
    dbUser = await db.user.create({
      data: { email: email, sub: user.sub, name: `${user.given_name} ${user.family_name}` },
    })
  }

  return { user, access, refresh, dbUser }
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const { user, access, refresh, dbUser } = await authenticateUser(email, password)
  await ctx.session.$create({ userData: user, userId: dbUser.id, role: dbUser.role as Role })
  await ctx.session.$setPrivateData({ bearerToken: access, refreshToken: refresh })
  return user
})
