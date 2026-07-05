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
                mainEntityOfPage: `${BASE}/about`,
                image: `${BASE}/logo.png`,
                jobTitle: "Full-Stack Software Developer",
                nationality: "Filipino",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Melbourne",
                    addressRegion: "Victoria",
                    addressCountry: "AU",
                },
                description:
                    "Brean Julius Carbonilla, known online as Breanzy, is a Filipino full-stack software developer based in Melbourne, Australia. Writes down-to-earth takes on the tech industry and life as a developer.",
                sameAs: [
                    "https://github.com/Breanzy",
                    "https://www.linkedin.com/in/juliuscarbonilla/",
                    "https://x.com/Breanzyy",
                ],
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
                author: { "@type": "Person", name: "Brean Julius Carbonilla", url: `${BASE}/about` },
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

interface ProjectSchemaProps {
    title: string;
    description?: string;
    image?: string;
    slug: string;
    techStack?: string[];
    liveUrl?: string;
    repoUrl?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export function ProjectSchema({
    title,
    description,
    image,
    slug,
    techStack,
    liveUrl,
    repoUrl,
    createdAt,
    updatedAt,
}: ProjectSchemaProps) {
    const url = `${BASE}/projects/${slug}`;
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: title,
                description,
                image: image || `${BASE}/logo.png`,
                url,
                sameAs: [liveUrl, repoUrl].filter(Boolean),
                applicationCategory: "DeveloperApplication",
                dateCreated: new Date(createdAt).toISOString(),
                dateModified: new Date(updatedAt).toISOString(),
                keywords: techStack?.join(", "),
                creator: { "@type": "Person", name: "Brean Julius Carbonilla", url: `${BASE}/about` },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
            }}
        />
    );
}

interface ItemListSchemaProps {
    items: { name: string; path: string }[];
}

export function ItemListSchema({ items }: ItemListSchemaProps) {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: items.map((item, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${BASE}${item.path}`,
                    name: item.name,
                })),
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
