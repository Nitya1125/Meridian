
export async function sendOtp(data){
    const response = await fetch("/api/signup/send-otp", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message)
    }

    return result
}


export async function verifyOtp(data){
    const response = await fetch("/api/signup/verify-otp", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message)
    }

    return result
}


export async function signup(data){
    const response = await fetch("/api/signup", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();        

    if(!response.ok){
        throw new Error(result.message)
    }    

    return result
}

export async function login(data){
    const response = await fetch("/api/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message || 'Login failed')
    }

    return result
}

export async function googleLogin(){
    window.location.href = '/api/auth/google';
}


export async function githubLogin(){
    window.location.href = '/api/auth/github';
}


export async function getCurrentUser(){
    const response = await fetch(`/api/auth/me`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message || "Unauthorized"); 
    }

    return result
}