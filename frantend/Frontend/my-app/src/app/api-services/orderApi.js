import axios from "axios"

let apibaseUrl = process.env.NEXT_PUBLIC_API_URL

let getOrders = (token) => {
    try {
        return axios.get(`${apibaseUrl}order/get-orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.data)
            .then((finalRes) => finalRes)
    }
    catch (err) {
        return err
    }
}

let getOrderDetails = (orderId, token) => {
    try {
        return axios.get(`${apibaseUrl}order/get-order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.data)
            .then((finalRes) => finalRes)
    }
    catch (err) {
        return err
    }
}

export { getOrders, getOrderDetails }
