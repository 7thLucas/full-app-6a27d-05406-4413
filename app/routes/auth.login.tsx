import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { LoginCard } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    return redirect("/dashboard", {
      headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid credentials";
    return { error: message };
  }
}

export default function LoginRoute() {
  const { config, loading } = useConfigurables();
  const appName = loading ? "Music Insight Analyzer" : (config?.appName ?? "Music Insight Analyzer");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #110F20 50%, #0F0F1A 100%)" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">{appName}</span>
          </div>
          <p className="text-sm text-[#94A3B8]">Sign in to your account</p>
        </div>

        <div className="music-card rounded-2xl p-1" style={{ background: "#1A1A2E" }}>
          <LoginCard />
        </div>

        <p className="text-center text-sm text-[#94A3B8]">
          Don't have an account?{" "}
          <a href="/auth/register" className="font-semibold text-[#7C3AED] hover:text-[#9155ff] transition-colors">
            Create one free
          </a>
        </p>
      </div>
    </div>
  );
}
