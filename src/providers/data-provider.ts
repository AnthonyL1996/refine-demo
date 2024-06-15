import type { DataProvider } from "@refinedev/core";

const API_URL = "https://api.fake-rest.refine.dev";


const fetcher = async (url: string, options?: RequestInit) => {
  const accessToken = localStorage.getItem("my_access_token");
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: accessToken ?? '',
    },
  });
};

export const dataProvider: DataProvider = {
    getOne: async ({ resource, id, meta }) => {
      const response = await fetcher(`${API_URL}/${resource}/${id}`);
  
      if (response.status < 200 || response.status > 299) throw response;
  
      const data = await response.json();
  
      return { data };
    },
    update: async ({ resource, id, variables }) => {
      const response = await fetcher(`${API_URL}/${resource}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(variables),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status < 200 || response.status > 299) throw response;
  
      const data = await response.json();
  
      return { data };
    },
    getApiUrl: () => API_URL,
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        const params = new URLSearchParams();

        if (pagination && pagination.current && pagination.pageSize) {
            params.append("_start", ((pagination.current - 1) * pagination.pageSize).toString());
            params.append("_end", (pagination.current * pagination.pageSize).toString());
          }

        if (sorters && sorters.length > 0) {
            params.append("_sort", sorters.map((sorter) => sorter.field).join(","));
            params.append("_order", sorters.map((sorter) => sorter.order).join(","));
          }

        if (filters && filters.length > 0) {
        filters.forEach((filter) => {
            if ("field" in filter && filter.operator === "eq") {
            // Our fake API supports "eq" operator by simply appending the field name and value to the query string.
            params.append(filter.field, filter.value);
            }
        });
        }

        
        const response = await fetcher(`${API_URL}/${resource}?${params.toString()}`);

        if (response.status < 200 || response.status > 299) throw response;
    
        const data = await response.json();

        const total = Number(response.headers.get("x-total-count"));
    
        return {
          data,
          total, // We'll cover this in the next steps.
        };
      },
      create: async ({ resource, variables }) => {
        const response = await fetcher(`${API_URL}/${resource}`, {
          method: "POST",
          body: JSON.stringify(variables),
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status < 200 || response.status > 299) throw response;
    
        const data = await response.json();
    
        return { data };
      },
    deleteOne: () => { throw new Error("Not implemented"); },
  // Optional methods:
  // getMany: () => { /* ... */ },
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids) {
      ids.forEach((id) => params.append("id", String(id)));
    }

    const response = await fetcher(`${API_URL}/${resource}?${params.toString()}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};