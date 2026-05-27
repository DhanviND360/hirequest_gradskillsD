import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/verify";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if profile exists and has verification
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, verification_status")
          .eq("id", user.id)
          .single();

        if (profile?.verification_status === "verified") {
          const redirect =
            profile.role === "recruiter" ? "/guild-hall" : "/profile";
          return NextResponse.redirect(`${origin}${redirect}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code exchange error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
