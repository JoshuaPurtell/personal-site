import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { OGTemplate } from "@utils/OGTemplate";
import path from "path"; // Added import for path

interface OGData {
    title: string;
    date: Date;
    image: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
    const blogEntries = await getCollection("blog");
    return blogEntries.map(({ slug, data }) => ({
        params: { slug },
        props: { title: data.title.toUpperCase(), date: data.publishDate, image: data.featuredImage.src },
    }));
};

export const GET: APIRoute<OGData> = async ({ props }) => {
    const fontPath = path.join(process.cwd(), 'dist', 'fonts', 'JetBrainsMono-Bold.ttf');
    
    const imagePath = path.join(process.cwd(), 'dist', '_astro', path.basename(props.image));
    console.log('Image path:', imagePath);
    console.log('Font path:', fontPath);
    
    const imageBuffer = await readFile(imagePath);
    const image = imageBuffer.toString('base64');

    const options: SatoriOptions = {
        width: 1200,
        height: 630,
        embedFont: true,
        fonts: [
            {
                name: "JetBrainsMono-Bold",
                data: await readFile(fontPath),
                weight: 900,
                style: "normal",
            },
        ],
    };

    const svg = await satori(OGTemplate({ ...props, image: image }, {}), options);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    return new Response(png, {
        headers: { 'Content-Type': 'image/png' },
    });
};
