import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isPlaceholder = 
    !url || 
    url.includes("your_supabase") || 
    !url.startsWith("http") || 
    !key || 
    key.includes("your_supabase");

  // Auth routing definitions
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/world-map") ||
    request.nextUrl.pathname.startsWith("/quest-log") ||
    request.nextUrl.pathname.startsWith("/skill-tree") ||
    request.nextUrl.pathname.startsWith("/inventory") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/video-resume") ||
    request.nextUrl.pathname.startsWith("/leaderboard") ||
    request.nextUrl.pathname.startsWith("/boss-fight") ||
    request.nextUrl.pathname.startsWith("/guild-hall") ||
    request.nextUrl.pathname.startsWith("/post-quest") ||
    request.nextUrl.pathname.startsWith("/scout") ||
    request.nextUrl.pathname.startsWith("/arena") ||
    request.nextUrl.pathname.startsWith("/pipeline") ||
    request.nextUrl.pathname.startsWith("/analytics") ||
    request.nextUrl.pathname.startsWith("/messages");

  if (isPlaceholder) {
    // Demo Mode: Check demo-auth cookie
    const hasDemoCookie = request.cookies.get("demo-auth")?.value === "true";

    if (!hasDemoCookie && isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  // Live Supabase Mode
  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("Supabase middleware error:", err);
    // Fallback: If auth fails, allow route navigation in development to prevent crashes
    return supabaseResponse;
  }

  return supabaseResponse;
}

