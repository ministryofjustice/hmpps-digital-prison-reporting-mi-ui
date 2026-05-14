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
    interface Locals extends ExtraLocals {
      /** When true, GOV.UK / MoJ initAll run only inside #main-content so API header/footer scripts own the banner. */
      scopeMoJGovInitToMain?: boolean
    }
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
