import { z } from "zod";

export const redeemAccessCodeSchema = z.object({
  code: z.string().min(1, "accessCodeRequired").max(32),
});

export type RedeemAccessCodeInput = z.infer<typeof redeemAccessCodeSchema>;
