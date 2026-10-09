import { http } from "./client";
import type { JudgeAssignment, JudgeScorePayload } from "@/types/api/domain";

export const judgingApi = {
  getAssignments: () => http.get<JudgeAssignment[]>("/judging/assignments"),
  getAssignment: (id: string) => http.get<JudgeAssignment>(`/judging/assignments/${id}`),
  submitScore: (body: JudgeScorePayload) => http.post<{ id: string }>("/judging/scores", body),
  saveDraft: (scoreId: string, body: Partial<JudgeScorePayload>) =>
    http.patch<{ id: string }>(`/judging/scores/${scoreId}/draft`, body),
  declareConflict: (assignmentId: string, reason: string) =>
    http.post<null>("/judging/conflicts", { assignmentId, reason }),
  headJudgeOverview: (categoryId?: string) =>
    http.get<unknown>("/judging/head-judge/overview", { categoryId }),
  assignJudge: (judgeId: string, nominationId: string) =>
    http.post<JudgeAssignment>("/judging/assignments", { judgeId, nominationId }),
};
