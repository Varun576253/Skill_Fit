import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActivityItem, AdminInfo, AdminLoginBody, AdminLoginResponse, ApiError, Candidate, CandidateDetail, CandidateListResponse, Classification, DashboardStats, DistrictStats, GetRecentActivityParams, HealthStatus, Interview, InterviewDetail, ListCandidatesParams, ListQuestionsParams, OfficerAction, OfficerActionBody, Question, RegisterCandidateBody, Response, ScoreResponseBody, ScoreResult, StartInterviewBody, SubmitResponseBody, TradeStats } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new candidate
 */
export declare const getRegisterCandidateUrl: () => string;
export declare const registerCandidate: (registerCandidateBody: RegisterCandidateBody, options?: RequestInit) => Promise<Candidate>;
export declare const getRegisterCandidateMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerCandidate>>, TError, {
        data: BodyType<RegisterCandidateBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerCandidate>>, TError, {
    data: BodyType<RegisterCandidateBody>;
}, TContext>;
export type RegisterCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof registerCandidate>>>;
export type RegisterCandidateMutationBody = BodyType<RegisterCandidateBody>;
export type RegisterCandidateMutationError = ErrorType<ApiError>;
/**
 * @summary Register a new candidate
 */
export declare const useRegisterCandidate: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerCandidate>>, TError, {
        data: BodyType<RegisterCandidateBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerCandidate>>, TError, {
    data: BodyType<RegisterCandidateBody>;
}, TContext>;
/**
 * @summary List all candidates (admin)
 */
export declare const getListCandidatesUrl: (params?: ListCandidatesParams) => string;
export declare const listCandidates: (params?: ListCandidatesParams, options?: RequestInit) => Promise<CandidateListResponse>;
export declare const getListCandidatesQueryKey: (params?: ListCandidatesParams) => readonly ["/api/candidates", ...ListCandidatesParams[]];
export declare const getListCandidatesQueryOptions: <TData = Awaited<ReturnType<typeof listCandidates>>, TError = ErrorType<unknown>>(params?: ListCandidatesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCandidatesQueryResult = NonNullable<Awaited<ReturnType<typeof listCandidates>>>;
export type ListCandidatesQueryError = ErrorType<unknown>;
/**
 * @summary List all candidates (admin)
 */
export declare function useListCandidates<TData = Awaited<ReturnType<typeof listCandidates>>, TError = ErrorType<unknown>>(params?: ListCandidatesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get candidate detail with interview data
 */
export declare const getGetCandidateUrl: (id: number) => string;
export declare const getCandidate: (id: number, options?: RequestInit) => Promise<CandidateDetail>;
export declare const getGetCandidateQueryKey: (id: number) => readonly [`/api/candidates/${number}`];
export declare const getGetCandidateQueryOptions: <TData = Awaited<ReturnType<typeof getCandidate>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCandidateQueryResult = NonNullable<Awaited<ReturnType<typeof getCandidate>>>;
export type GetCandidateQueryError = ErrorType<ApiError>;
/**
 * @summary Get candidate detail with interview data
 */
export declare function useGetCandidate<TData = Awaited<ReturnType<typeof getCandidate>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start a new interview for a candidate
 */
export declare const getStartInterviewUrl: () => string;
export declare const startInterview: (startInterviewBody: StartInterviewBody, options?: RequestInit) => Promise<Interview>;
export declare const getStartInterviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startInterview>>, TError, {
        data: BodyType<StartInterviewBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startInterview>>, TError, {
    data: BodyType<StartInterviewBody>;
}, TContext>;
export type StartInterviewMutationResult = NonNullable<Awaited<ReturnType<typeof startInterview>>>;
export type StartInterviewMutationBody = BodyType<StartInterviewBody>;
export type StartInterviewMutationError = ErrorType<unknown>;
/**
 * @summary Start a new interview for a candidate
 */
export declare const useStartInterview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startInterview>>, TError, {
        data: BodyType<StartInterviewBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startInterview>>, TError, {
    data: BodyType<StartInterviewBody>;
}, TContext>;
/**
 * @summary Get interview with responses
 */
export declare const getGetInterviewUrl: (id: number) => string;
export declare const getInterview: (id: number, options?: RequestInit) => Promise<InterviewDetail>;
export declare const getGetInterviewQueryKey: (id: number) => readonly [`/api/interviews/${number}`];
export declare const getGetInterviewQueryOptions: <TData = Awaited<ReturnType<typeof getInterview>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInterview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInterview>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInterviewQueryResult = NonNullable<Awaited<ReturnType<typeof getInterview>>>;
export type GetInterviewQueryError = ErrorType<unknown>;
/**
 * @summary Get interview with responses
 */
export declare function useGetInterview<TData = Awaited<ReturnType<typeof getInterview>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInterview>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get per-session randomized questions for an active interview
 */
export declare const getGetInterviewQuestionsUrl: (id: number) => string;
export declare const getInterviewQuestions: (id: number, options?: RequestInit) => Promise<Question[]>;
export declare const getGetInterviewQuestionsQueryKey: (id: number) => readonly [`/api/interviews/${number}/questions`];
export declare const getGetInterviewQuestionsQueryOptions: <TData = Awaited<ReturnType<typeof getInterviewQuestions>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInterviewQuestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInterviewQuestions>>, TError, TData> & {
    queryKey: QueryKey;
};
export declare function useGetInterviewQuestions<TData = Awaited<ReturnType<typeof getInterviewQuestions>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInterviewQuestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark interview as complete
 */
export declare const getCompleteInterviewUrl: (id: number) => string;
export declare const completeInterview: (id: number, options?: RequestInit) => Promise<Interview>;
export declare const getCompleteInterviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeInterview>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof completeInterview>>, TError, {
    id: number;
}, TContext>;
export type CompleteInterviewMutationResult = NonNullable<Awaited<ReturnType<typeof completeInterview>>>;
export type CompleteInterviewMutationError = ErrorType<unknown>;
/**
 * @summary Mark interview as complete
 */
export declare const useCompleteInterview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeInterview>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof completeInterview>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Submit a response for a question
 */
export declare const getSubmitResponseUrl: (id: number) => string;
export declare const submitResponse: (id: number, submitResponseBody: SubmitResponseBody, options?: RequestInit) => Promise<Response>;
export declare const getSubmitResponseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitResponse>>, TError, {
        id: number;
        data: BodyType<SubmitResponseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitResponse>>, TError, {
    id: number;
    data: BodyType<SubmitResponseBody>;
}, TContext>;
export type SubmitResponseMutationResult = NonNullable<Awaited<ReturnType<typeof submitResponse>>>;
export type SubmitResponseMutationBody = BodyType<SubmitResponseBody>;
export type SubmitResponseMutationError = ErrorType<unknown>;
/**
 * @summary Submit a response for a question
 */
export declare const useSubmitResponse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitResponse>>, TError, {
        id: number;
        data: BodyType<SubmitResponseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitResponse>>, TError, {
    id: number;
    data: BodyType<SubmitResponseBody>;
}, TContext>;
/**
 * @summary Get questions for a trade and language
 */
export declare const getListQuestionsUrl: (params: ListQuestionsParams) => string;
export declare const listQuestions: (params: ListQuestionsParams, options?: RequestInit) => Promise<Question[]>;
export declare const getListQuestionsQueryKey: (params?: ListQuestionsParams) => readonly ["/api/questions", ...ListQuestionsParams[]];
export declare const getListQuestionsQueryOptions: <TData = Awaited<ReturnType<typeof listQuestions>>, TError = ErrorType<unknown>>(params: ListQuestionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listQuestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listQuestions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListQuestionsQueryResult = NonNullable<Awaited<ReturnType<typeof listQuestions>>>;
export type ListQuestionsQueryError = ErrorType<unknown>;
/**
 * @summary Get questions for a trade and language
 */
export declare function useListQuestions<TData = Awaited<ReturnType<typeof listQuestions>>, TError = ErrorType<unknown>>(params: ListQuestionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listQuestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Score a candidate response using Gemini AI
 */
export declare const getScoreResponseUrl: () => string;
export declare const scoreResponse: (scoreResponseBody: ScoreResponseBody, options?: RequestInit) => Promise<ScoreResult>;
export declare const getScoreResponseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scoreResponse>>, TError, {
        data: BodyType<ScoreResponseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof scoreResponse>>, TError, {
    data: BodyType<ScoreResponseBody>;
}, TContext>;
export type ScoreResponseMutationResult = NonNullable<Awaited<ReturnType<typeof scoreResponse>>>;
export type ScoreResponseMutationBody = BodyType<ScoreResponseBody>;
export type ScoreResponseMutationError = ErrorType<unknown>;
/**
 * @summary Score a candidate response using Gemini AI
 */
export declare const useScoreResponse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scoreResponse>>, TError, {
        data: BodyType<ScoreResponseBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof scoreResponse>>, TError, {
    data: BodyType<ScoreResponseBody>;
}, TContext>;
/**
 * @summary Classify a completed interview
 */
export declare const getClassifyInterviewUrl: (interviewId: number) => string;
export declare const classifyInterview: (interviewId: number, options?: RequestInit) => Promise<Classification>;
export declare const getClassifyInterviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof classifyInterview>>, TError, {
        interviewId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof classifyInterview>>, TError, {
    interviewId: number;
}, TContext>;
export type ClassifyInterviewMutationResult = NonNullable<Awaited<ReturnType<typeof classifyInterview>>>;
export type ClassifyInterviewMutationError = ErrorType<unknown>;
/**
 * @summary Classify a completed interview
 */
export declare const useClassifyInterview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof classifyInterview>>, TError, {
        interviewId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof classifyInterview>>, TError, {
    interviewId: number;
}, TContext>;
/**
 * @summary Admin officer login
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (adminLoginBody: AdminLoginBody, options?: RequestInit) => Promise<AdminLoginResponse>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginBody>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginBody>;
export type AdminLoginMutationError = ErrorType<ApiError>;
/**
 * @summary Admin officer login
 */
export declare const useAdminLogin: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginBody>;
}, TContext>;
/**
 * @summary Admin logout
 */
export declare const getAdminLogoutUrl: () => string;
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
 * @summary Admin logout
 */
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
/**
 * @summary Get current admin session
 */
export declare const getGetAdminMeUrl: () => string;
export declare const getAdminMe: (options?: RequestInit) => Promise<AdminInfo>;
export declare const getGetAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getGetAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminMe>>>;
export type GetAdminMeQueryError = ErrorType<void>;
/**
 * @summary Get current admin session
 */
export declare function useGetAdminMe<TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Record an officer action on a candidate
 */
export declare const getCreateOfficerActionUrl: () => string;
export declare const createOfficerAction: (officerActionBody: OfficerActionBody, options?: RequestInit) => Promise<OfficerAction>;
export declare const getCreateOfficerActionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOfficerAction>>, TError, {
        data: BodyType<OfficerActionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOfficerAction>>, TError, {
    data: BodyType<OfficerActionBody>;
}, TContext>;
export type CreateOfficerActionMutationResult = NonNullable<Awaited<ReturnType<typeof createOfficerAction>>>;
export type CreateOfficerActionMutationBody = BodyType<OfficerActionBody>;
export type CreateOfficerActionMutationError = ErrorType<unknown>;
/**
 * @summary Record an officer action on a candidate
 */
export declare const useCreateOfficerAction: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOfficerAction>>, TError, {
        data: BodyType<OfficerActionBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOfficerAction>>, TError, {
    data: BodyType<OfficerActionBody>;
}, TContext>;
/**
 * @summary Get audit log for a candidate
 */
export declare const getGetCandidateActionsUrl: (candidateId: number) => string;
export declare const getCandidateActions: (candidateId: number, options?: RequestInit) => Promise<OfficerAction[]>;
export declare const getGetCandidateActionsQueryKey: (candidateId: number) => readonly [`/api/admin/actions/${number}`];
export declare const getGetCandidateActionsQueryOptions: <TData = Awaited<ReturnType<typeof getCandidateActions>>, TError = ErrorType<unknown>>(candidateId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidateActions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCandidateActions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCandidateActionsQueryResult = NonNullable<Awaited<ReturnType<typeof getCandidateActions>>>;
export type GetCandidateActionsQueryError = ErrorType<unknown>;
/**
 * @summary Get audit log for a candidate
 */
export declare function useGetCandidateActions<TData = Awaited<ReturnType<typeof getCandidateActions>>, TError = ErrorType<unknown>>(candidateId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidateActions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard summary statistics
 */
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/stats/dashboard"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get candidate counts grouped by trade
 */
export declare const getGetStatsByTradeUrl: () => string;
export declare const getStatsByTrade: (options?: RequestInit) => Promise<TradeStats[]>;
export declare const getGetStatsByTradeQueryKey: () => readonly ["/api/stats/by-trade"];
export declare const getGetStatsByTradeQueryOptions: <TData = Awaited<ReturnType<typeof getStatsByTrade>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsByTrade>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsByTrade>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsByTradeQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsByTrade>>>;
export type GetStatsByTradeQueryError = ErrorType<unknown>;
/**
 * @summary Get candidate counts grouped by trade
 */
export declare function useGetStatsByTrade<TData = Awaited<ReturnType<typeof getStatsByTrade>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsByTrade>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get candidate counts grouped by district
 */
export declare const getGetStatsByDistrictUrl: () => string;
export declare const getStatsByDistrict: (options?: RequestInit) => Promise<DistrictStats[]>;
export declare const getGetStatsByDistrictQueryKey: () => readonly ["/api/stats/by-district"];
export declare const getGetStatsByDistrictQueryOptions: <TData = Awaited<ReturnType<typeof getStatsByDistrict>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsByDistrict>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsByDistrict>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsByDistrictQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsByDistrict>>>;
export type GetStatsByDistrictQueryError = ErrorType<unknown>;
/**
 * @summary Get candidate counts grouped by district
 */
export declare function useGetStatsByDistrict<TData = Awaited<ReturnType<typeof getStatsByDistrict>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsByDistrict>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent interview activity feed
 */
export declare const getGetRecentActivityUrl: (params?: GetRecentActivityParams) => string;
export declare const getRecentActivity: (params?: GetRecentActivityParams, options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetRecentActivityQueryKey: (params?: GetRecentActivityParams) => readonly ["/api/stats/recent-activity", ...GetRecentActivityParams[]];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(params?: GetRecentActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent interview activity feed
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(params?: GetRecentActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map