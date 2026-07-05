"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

/**
 * Intentionally no PersistGate here. redux-persist rehydrates from
 * localStorage automatically once `persistor` is created in store.ts —
 * gating {children} behind that rehydration would render `null` for
 * every page during SSR (localStorage doesn't exist server-side),
 * which killed static HTML output sitewide. Server render and first
 * client render both start from the same un-hydrated state, so there's
 * no hydration mismatch; persisted user state just fills in a moment later.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
