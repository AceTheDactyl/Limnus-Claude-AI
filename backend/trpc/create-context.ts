import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// User type for development
interface User {
  id: string;
  sub: string;
  email: string;
  name?: string;
  groups: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock user for development - replace with actual JWT verification
const mockUser: User = {
  id: 'user-1',
  sub: 'mock-sub-123',
  email: 'admin@example.com',
  name: 'Admin User',
  groups: ['admin', 'moderator'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // TODO: Extract and verify JWT token from Authorization header
  // const authHeader = opts.req.headers.get('authorization');
  // const token = authHeader?.replace('Bearer ', '');
  // const user = await verifyJWT(token);
  
  return {
    req: opts.req,
    user: mockUser, // Replace with actual user from JWT
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Auth middleware
const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});

// Role-based middleware
const requireRole = (roles: string[]) => t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  
  const hasRole = roles.some(role => ctx.user!.groups.includes(role));
  if (!hasRole) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Requires one of: ${roles.join(', ')}`
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(requireRole(['admin']));
export const moderatorProcedure = t.procedure.use(requireRole(['admin', 'moderator']));