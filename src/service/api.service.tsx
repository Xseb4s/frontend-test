export const DNS = {
    host: import.meta.env.VITE_BASE_URL,
};
export const ROUTES = {
    READPRODUCTS: `${DNS.host}/products`,
    READCART: `${DNS.host}/cart`,
    ADDCART: (id: number) => `${DNS.host}/cart/${id}`,
};