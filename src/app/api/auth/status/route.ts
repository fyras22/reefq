import { createRouteSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createRouteSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          authenticated: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authenticated: !!data.session,
      user: data.session?.user
        ? {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.name,
            avatar_url: data.session.user.user_metadata?.avatar_url,
          }
        : null,
      // Don't expose tokens in the response
      sessionExists: !!data.session,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        authenticated: false,
      },
      { status: 500 }
    );
  }
}
