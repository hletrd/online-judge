ALTER TABLE "assignments" ADD CONSTRAINT "assignments_late_penalty_nonneg" CHECK ("late_penalty" >= 0);
