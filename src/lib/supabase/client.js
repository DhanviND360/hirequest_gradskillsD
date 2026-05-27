import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isPlaceholder = 
    !url || 
    url.includes("your_supabase") || 
    !url.startsWith("http") || 
    !key || 
    key.includes("your_supabase");

  if (isPlaceholder) {
    console.warn("⚠️ HireQuest running in Offline Demo Mode. Placeholder Supabase credentials detected.");
    
    return {
      auth: {
        signUp: async ({ email, password, options }) => {
          // Store a mock session cookie
          document.cookie = "demo-auth=true; path=/";
          return {
            data: { 
              user: { 
                id: "mock-adventurer-id", 
                email, 
                user_metadata: options?.data || {} 
              } 
            }, 
            error: null 
          };
        },
        signInWithPassword: async ({ email, password }) => {
          // Store a mock session cookie
          document.cookie = "demo-auth=true; path=/";
          return { 
            data: { 
              user: { 
                id: "mock-adventurer-id", 
                email, 
                user_metadata: { display_name: "Arjun Sharma", role: "candidate" } 
              } 
            }, 
            error: null 
          };
        },
        getUser: async () => {
          const hasCookie = document.cookie.includes("demo-auth=true");
          if (!hasCookie) return { data: { user: null }, error: null };
          return { 
            data: { 
              user: { 
                id: "mock-adventurer-id", 
                email: "adventurer@hirequest.io", 
                user_metadata: { display_name: "Arjun Sharma", role: "candidate" } 
              } 
            }, 
            error: null 
          };
        },
        signOut: async () => {
          // Clear demo session cookie
          document.cookie = "demo-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          return { error: null };
        }
      },
      storage: {
        from: (bucket) => ({
          upload: async (path, fileOrBlob, options) => {
            return { data: { path }, error: null };
          },
          getPublicUrl: (path) => {
            return { data: { publicUrl: `https://mock-storage.hirequest.io/${bucket}/${path}` } };
          }
        })
      },
      from: (table) => ({
        select: (columns) => ({
          eq: (field, val) => ({
            single: async () => {
              return { 
                data: { 
                  id: "mock-adventurer-id",
                  role: "candidate", 
                  verification_status: "verified",
                  display_name: "Arjun Sharma"
                }, 
                error: null 
              };
            }
          }),
          single: async () => {
            return { 
              data: { 
                id: "mock-adventurer-id",
                role: "candidate", 
                verification_status: "verified",
                display_name: "Arjun Sharma"
              }, 
              error: null 
            };
          }
        }),
        update: (values) => ({
          eq: (field, val) => ({
            select: () => ({
              single: async () => ({ data: values, error: null })
            }),
            single: async () => ({ data: values, error: null })
          }),
          single: async () => ({ data: values, error: null })
        }),
        insert: (values) => ({
          single: async () => ({ data: values, error: null })
        })
      })
    };
  }

  return createBrowserClient(url, key);
}

