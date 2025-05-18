

const API_BASE = process.env.API_URL

export async function fetchOneDelegate(accessToken?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard/whoami`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
        credentials: "include",
        },
    });
    
    if (!res.ok) {
        return null
    }
    
    const resBody = await res.json();
    return resBody;
}

export async function fetchDelegates(accessToken?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard/participants`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
        credentials: "include",
        },
    });
    
    if (!res.ok) {
        return null
    }
    
    const resBody = await res.json();
    return resBody;
}