import axios from "axios"
import { useEffect, useState } from "react"
import { PRODUCT_ENDPOINTS } from "../pages/endpoints"
import { shallowEqual, useSelector } from "react-redux"
import { useMemo } from "react"

export function useGetAllProduct(refresh, query = "", page,setPage) {
    const [products, setProducts] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [queryVersion, setQueryVersion] = useState(0);
    const flavorArray = useSelector((state) => state?.filter?.flavorFilter, shallowEqual)
    const breedArray = useSelector((state) => state?.filter?.breedFilter, shallowEqual)
    const dietArray = useSelector((state) => state?.filter?.diet, shallowEqual)
    const pet = useSelector((state) => state?.filter?.pet)
    const brandsArray = useSelector((state) => state?.filter?.brandsFilter, shallowEqual)
    const type = useSelector((state) => state?.filter?.typeFilter)

    useEffect(() => {
        setProducts([]);
        setHasMore(true);
        setPage(1);
        setQueryVersion(prev => prev + 1); 
    }, [flavorArray, breedArray, dietArray, brandsArray, type, pet, query, refresh, setPage]);
    
    useEffect(() => {
        async function fetchProducts() {
            if (loading || !hasMore) return;
            setLoading(true);
            try {
                let userQuery

                /// constructing userQuery for filter
                userQuery = [
                    ...flavorArray,
                    ...breedArray,
                    ...dietArray,
                    pet,
                    ...brandsArray,
                    type
                ]
                    .filter(Boolean) // remove undefined/empty strings
                    .join(" ");

                userQuery += " ";
                userQuery += query;  /// adding this query for the search bar

                console.log("User query :" + userQuery)
                userQuery = userQuery.trim()

                const res = await axios.post(`${PRODUCT_ENDPOINTS}/displayProduct`, { userQuery, limit: 20, page }, { withCredentials: true })
                // console.log("Product details res ",res.data.products)
                setProducts((prev) =>
                    page === 1
                        ? res.data.products
                        : [...prev, ...res.data.products]
                );

                setHasMore(res.data.hasMore);

            } catch (error) {
                console.log("server went down at the time of fetching the product" + error);
            }
            setLoading(false);
        }

        fetchProducts()
    }, [page, queryVersion]) /// refresh is used in order to handle when the variation of the product is deleted
    return { productData: products, hasMore, loading }
}