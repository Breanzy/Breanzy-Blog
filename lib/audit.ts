type AuditFields = {
    actorId?: string;
    targetId?: string;
    status?: "success" | "failure";
    detail?: string;
};

/* Writes a structured audit event without including request bodies or secrets. */
export function auditEvent(event: string, fields: AuditFields = {}) {
    console.info(JSON.stringify({ event, at: new Date().toISOString(), ...fields }));
}
