function buildUrl(
  page: number,
  limit: string,
  start_date: string | null,
  end_date: string | null,
  status: string,
  type: string | null = null
) {
  const baseUrl = `?page=${page}&limit=${limit}`;
  const queryParams: string[] = [];
  if (start_date) {
    queryParams.push(`start_date=${start_date}`);
  }
  if (end_date) {
    queryParams.push(`end_date=${end_date}`);
  }

  if (type) {
    queryParams.push(`${type}=${status}`);
  } else if (status && status !== "ALL") {
    queryParams.push(`status=${status}`);
  }
  return `${baseUrl}${
    queryParams.length > 0 ? "&" + queryParams.join("&") : ""
  }`;
}

function convertToISO8601(dateString: any) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString();
}

export default function useOrders() {
  const simpleListFilter = (params: {
    currentPage: number;
    limit: string;
    start_date: any;
    end_date: any;
    status: string;
    type?: string;
  }) => {
    const url = buildUrl(
      params?.currentPage,
      params?.limit,
      convertToISO8601(params?.start_date),
      convertToISO8601(params?.end_date),
      params?.status,
      params?.type
    );
    return url;
  };
  return {
    simpleListFilter,
  };
}
