export async function api (url, data, method = 'GET') {
    const params = Object.assign({
        method,
        body: JSON.stringify(data)
    });

    // params = Object.assign({
    //     mode: 'cors',
    //     cache: 'no-cache',
    // }, params)

    params.headers = Object.assign({
        // Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json'
    }, params.headers)

    let response = await fetch(`/api${url}`, params)
    let json = await response.json() || {}
    if (!response.ok){
        let errorMessage = json.error || response.status
        throw new Error(errorMessage)
    }
    return json
}
