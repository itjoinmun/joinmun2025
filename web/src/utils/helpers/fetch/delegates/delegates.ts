

const API_BASE = process.env.API_URL

// TO DO: tolong benerin type nya sesuai postman siapa aja
export async function getDelegate(accessToken?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard/whoami`, {
        headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
        credentials: "include",
        },
    }).then(res => res.json());
    
    if (!res.ok) {
        return null
    }

    return res;
}

export async function getDelegates(accessToken?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard/participants`, {
        headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
        credentials: "include",
        },
    }).then(res => res.json());
    
    if (!res.ok) {
        return null
    }

    return res;
}