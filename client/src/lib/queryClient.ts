import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data.message) {
        errorText = data.message;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    throw new Error(errorText);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  body?: any
): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  await throwIfResNotOk(res);

  if (res.status === 204) {
    return undefined;
  }

  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (
  context: any 
) => Promise<T | null> = (options) => async (context) => {
  let url = context.queryKey;
  if (Array.isArray(url)) {
    url = url[0];
  }

  try {
    const res = await fetch(url);

    if (res.status === 401) {
      if (options.on401 === "returnNull") {
        return null;
      } else {
        throw new Error("Unauthorized");
      }
    }

    await throwIfResNotOk(res);

    return res.json();
  } catch (e) {
    throw e;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      queryFn: getQueryFn<any>({ on401: "throw" }),
      retry: 1,
    },
  },
});
