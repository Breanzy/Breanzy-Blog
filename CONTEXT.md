# Breanzy Context

## Domain Terms

- **Access Policy**: The rules that decide whether a request belongs to a current user, a current admin, or no valid account.
- **Publishing Workflow**: The sequence for creating or updating public Posts and Projects, including validation, rich text sanitization, slugging, ownership, cache revalidation, and audit events.
- **Newsletter Delivery**: The process that sends post notifications to Subscribers and records delivery outcomes.
- **Media Lifecycle**: The browser-side flow for image selection, preview, upload, rollback, and replacement cleanup in Firebase Storage.
- **Dashboard Collection**: A paginated admin-facing list that supports loading more items and deleting one item from local state after the server accepts the mutation.
- **Editor Workflow**: The browser-side flow for editing rich content and persisting it with related media.
