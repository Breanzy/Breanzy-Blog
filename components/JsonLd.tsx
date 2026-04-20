export default function JsonLd({ data }: { data: Record<string, any> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

const BASE = process.env.SITE_URL ?? "https://breanzy.com";

export function PersonSchema() {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Brean Julius Carbonilla",
                alternateName: "Breanzy",
                url: BASE,
                image: `${BASE}/logo.png`,
                jobTitle: "Full-Stack Developer",
                description:
                    "Full-stack developer in the Philippines. Writes about life as a software developer.",
            }}
        />
    );
}

export function WebSiteSchema() {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Breanzy",
                url: BASE,
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${BASE}/search?searchTerm={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            }}
        />
    );
}

interface ArticleProps {
    title: string;
    description?: string;
    image?: string;
    slug: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export function ArticleSchema({ title, description, image, slug, createdAt, updatedAt }: ArticleProps) {
    const url = `${BASE}/blog/${slug}`;
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "Article",
                headline: title,
                description,
                image: image || `${BASE}/logo.png`,
                datePublished: new Date(createdAt).toISOString(),
                dateModified: new Date(updatedAt).toISOString(),
                author: { "@type": "Person", name: "Brean Julius Carbonilla", url: BASE },
                publisher: {
                    "@type": "Person",
                    name: "Brean Julius Carbonilla",
                    logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
            }}
        />
    );
}

interface Crumb {
    name: string;
    path: string;
}

export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: items.map((c, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: c.name,
                    item: `${BASE}${c.path}`,
                })),
            }}
        />
    );
}
