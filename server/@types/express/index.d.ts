import { ExtraLocals } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/extraLocals'
import { UserDetails } from '../../services/userService'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    userDetails: UserDetails
    userInitialised: boolean
    bookmarksInitialised: boolean
  }
}

export declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Locals extends ExtraLocals {}
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }
  }
}
