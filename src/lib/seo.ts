import { DefaultSeoProps } from "next-seo";

export const defaultSEO: DefaultSeoProps = {
  title: "awesome-devops-cloud-ui",
  description: "A visual, categorized hub to explore DevOps & Cloud tools with ease",
  canonical: "https://awesomedevopsui.site/",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesomedevopsui.site/",
    siteName: "awesome-devops-cloud-ui",
    images: [
      {
        url: "https://i.ibb.co/wdxr6M8/seo.png",
        width: 1200,
        height: 630,
        alt: "awesome-devops-cloud-ui",
      },
    ],
  },
  twitter: {
    handle: "@yourtwitterhandle",
    site: "@site",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "devops, cloud, tools, awesome, github, readme, cloud computing, devops tools, awesome list",
    },
  ],
};

export const getSEO = (pageSEO?: Partial<DefaultSeoProps>): DefaultSeoProps => {
  return {
    ...defaultSEO,
    ...pageSEO,
    openGraph: {
      ...defaultSEO.openGraph,
      ...pageSEO?.openGraph,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...pageSEO?.twitter,
    },
  };
};
