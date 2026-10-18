import { keepPreviousData, useQuery } from '@tanstack/react-query'
import paySummaryApi from 'apis/paySummary'
import { QUERY_KEYS } from 'constants/query'

export const usePaySummary = (country) =>
  useQuery({
    queryKey: [QUERY_KEYS.PAY_SUMMARY, country],
    queryFn: ({ signal }) => paySummaryApi.show({ country }, { signal }),
    placeholderData: keepPreviousData,
  })
