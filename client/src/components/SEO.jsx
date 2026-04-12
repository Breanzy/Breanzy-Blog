import { useEffect } from "react";

const SITE_NAME = "Breanzy";
const SITE_URL = "https://breanzy.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
    "Brean Julius Carbonilla — full-stack developer based in the Philippines. I build web apps and write about what I learn.";

/* Sets <title> and all meta/og/twitter tags for the current page.
   All props are optional — falls back to site-wide defaults. */
export default function SEO({ title, description, image, url, type = "website" }) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Brean Julius Carbonilla`;
    const metaDesc = description || DEFAULT_DESCRIPTION;
    const metaImage = image || DEFAULT_OG_IMAGE;
    const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    useEffect(() => {
        document.title = fullTitle;

        const set = (selector, attr, value) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                const [attrName] = attr.split("=").map((s) => s.replace(/['"]/g, ""));
                el.setAttribute(attrName, selector.match(/\[(.+?)=/)?.[1]?.replace(/['"]/g, "") ?? attrName);
                document.head.appendChild(el);
            }
            el.setAttribute(attr.split("=")[0].replace("[", ""), value);
        };

        // Standard
        setMeta("description", metaDesc);
        // Open Graph
        setOG("og:title", fullTitle);
        setOG("og:description", metaDesc);
        setOG("og:image", metaImage);
        setOG("og:url", metaUrl);
        setOG("og:type", type);
        setOG("og:site_name", SITE_NAME);
        // Twitter Card
        setMeta("twitter:card", "summary_large_image");
        setMeta("twitter:title", fullTitle);
        setMeta("twitter:description", metaDesc);
        setMeta("twitter:image", metaImage);
        // Canonical
        let canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", metaUrl);
    }, [fullTitle, metaDesc, metaImage, metaUrl, type]);

    return null;
}

function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setOG(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}
